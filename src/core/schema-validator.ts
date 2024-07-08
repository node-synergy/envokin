import type { UnknownRecord } from 'type-fest';

import { ValidationError } from '#core/validation-error.js';
import type { TSchema } from '#types/index.js';

export class SchemaValidator {
	public constructor (
		private readonly schema: TSchema,
		private readonly strict?: boolean
	) { }

	private isHost (value: unknown): boolean {
		return typeof value === 'string'
			&& (this.isURL(value) || this.isIP(value));
	}

	private isPort (value: unknown): boolean {
		return !Number.isNaN(Number(value))
			&& Number(value) >= 0
			&& Number(value) <= 65535;
	}

	private isURL (value: unknown): boolean {
		if (typeof value !== 'string') return false;

		try {
			return !!new URL(value).toString();
		} catch {
			return false;
		}
	}

	private isEmail (value: unknown): boolean {
		return typeof value === 'string'
			&& /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
	}

	private isArray (value: unknown): boolean {
		return Array.isArray(value);
	}

	private isIP (value: unknown): boolean {
		return typeof value === 'string'
			&& (this.isIP4(value) || this.isIP6(value));
	}

	private isIP4 (value: unknown): boolean {
		if (typeof value !== 'string') return false;

		const segments = value.split('.');
		if (segments.length !== 4) return false;
		return segments.every(
			segment => !Number.isNaN(Number(segment))
				&& Number(segment) >= 0
				&& Number(segment) <= 255
		);
	}

	private isIP6 (value: unknown): boolean {
		if (typeof value !== 'string') return false;

		const segments = value.split(':');
		if (segments.length < 1 || segments.length > 8) return false;
		return segments.every(segment => /^[0-9a-fA-F]{0,4}$/.test(segment));
	}

	private isString (value: unknown): boolean {
		return typeof value === 'string';
	}

	private isNumber (value: unknown): boolean {
		return typeof value === 'number'
			|| (typeof value === 'string' && !Number.isNaN(Number(value)));
	}

	private isBoolean (value: unknown): boolean {
		if (typeof value === 'boolean') return true;

		if (typeof value === 'string') {
			if (value === 'true'
				|| value === 'false'
				|| value === '1'
				|| value === '0'
				|| value === 't'
				|| value === 'f'
			) return true;
		}

		if (typeof value === 'number')
			if (value === 1 || value === 0) return true;

		return false;
	}

	private toBoolean (value: unknown): boolean {
		if (typeof value === 'boolean') return value;

		if (typeof value === 'string') {
			if (
				value === 'true'
				|| value === '1'
				|| value === 't'
			) return true;
			else return false;
		}

		if (typeof value === 'number') {
			if (value === 1) return true;
			else return false;
		}

		return false;
	}

	private isJSON (value: unknown): boolean {
		if (typeof value === 'object' && value) return true;
		if (typeof value !== 'string' || !value) return false;
		try {
			JSON.parse(value);
			return true;
		} catch {
			return false;
		}
	}

	public validateAndTransform (record: UnknownRecord): UnknownRecord {
		const result: UnknownRecord = {};

		for (const key in this.schema) {
			const type = this.schema[key];
			const value = record[key];

			if (!value && !!this.strict)
				throw new ValidationError(`The value for the key "${key}" is required but not provided.`);

			if (!value && !this.strict) continue;

			if (typeof type === 'object') {
				if (!type.validator(key, value))
					throw new ValidationError(`Custom validation failed for the key "${key}".`);
				result[key] = type.transformer(value);
				continue;
			}

			switch (type) {
				case 'host':
					if (!this.isHost(value)) throw new ValidationError(`"${key}" should be a valid host.`);
					result[key] = value;
					break;
				case 'port':
					if (!this.isPort(value)) throw new ValidationError(`"${key}" should be a valid port.`);
					result[key] = Number(value);
					break;
				case 'url':
					if (!this.isURL(value)) throw new ValidationError(`"${key}" should be a valid url.`);
					result[key] = value;
					break;
				case 'email':
					if (!this.isEmail(value)) throw new ValidationError(`"${key}" should be a valid email.`);
					result[key] = value;
					break;
				case 'array':
					if (!this.isArray(value)) throw new ValidationError(`"${key}" should be a valid array.`);
					result[key] = value;
					break;
				case 'array:separator=,':
					if (!this.isString(value)) throw new ValidationError(`"${key}" should be a string with values separated by ",".`);
					result[key] = (value as string).split(',').map(v => v.trim());
					break;
				case 'ip':
					if (!this.isIP(value)) throw new ValidationError(`"${key}" should be a valid IP address.`);
					result[key] = value;
					break;
				case 'ip4':
					if (!this.isIP4(value)) throw new ValidationError(`"${key}" should be a valid IP4 address.`);
					result[key] = value;
					break;
				case 'ip6':
					if (!this.isIP6(value)) throw new ValidationError(`"${key}" should be a valid IP6 address.`);
					result[key] = value;
					break;
				case 'string':
					if (!this.isString(value)) throw new ValidationError(`"${key}" should be a valid string.`);
					result[key] = value;
					break;
				case 'number':
					if (!this.isNumber(value)) throw new ValidationError(`"${key}" should be a valid number.`);
					result[key] = Number(value);
					break;
				case 'boolean':
					if (!this.isBoolean(value)) throw new ValidationError(`"${key}" should be a valid boolean.`);
					result[key] = this.toBoolean(value);
					break;
				case 'json':
					if (!this.isJSON(value)) throw new ValidationError(`"${key} should be a valid JSON.`);
					result[key] = typeof value === 'object' ? value : JSON.parse(value as string);
					break;
			}
		}

		return result;
	}
}
