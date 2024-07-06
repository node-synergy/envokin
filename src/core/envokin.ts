import { resolve } from 'node:path';

import type { UnknownRecord } from 'type-fest';

import { Loader } from '#core/loader.js';
import { SchemaValidator } from '#core/schema-validator.js';
import type {
	IEnvokinOptions,
	TEnvironment,
	TSchema
} from '#types/index.js';

export class Envokin<Schema extends TSchema = TSchema> {
	private readonly loader?: Loader;
	private readonly environment: TEnvironment<Schema>;

	public constructor (schema: Schema, options?: IEnvokinOptions) {
		const source = options?.source || process.env;
		if (typeof source === 'string')
			this.loader = new Loader(resolve(source));

		const environment = !this.loader
			? source as UnknownRecord
			: this.loader.load();

		const parsedEnvironment = new SchemaValidator(schema, options?.strict)
			.validateAndTransform(environment);

		this.environment = Object.freeze({
			...parsedEnvironment,
			NODE_ENV: parsedEnvironment['NODE_ENV'] ? String(parsedEnvironment['NODE_ENV']) : 'development'
		}) as TEnvironment<Schema>;
	}

	public get isDev (): boolean {
		return this.environment.NODE_ENV === 'development'
			|| this.environment.NODE_ENV === 'dev'
			|| this.environment.NODE_ENV === 'develop';
	}

	public get isTest (): boolean {
		return this.environment.NODE_ENV === 'test'
			|| this.environment.NODE_ENV === 't';
	}

	public get isProduction (): boolean {
		return this.environment.NODE_ENV === 'production'
			|| this.environment.NODE_ENV === 'prod';
	}

	public get<Key extends keyof TEnvironment<Schema>> (key: Key): TEnvironment<Schema>[Key] {
		return this.environment[key];
	}
}