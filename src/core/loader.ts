import { readFileSync } from 'node:fs';

import type { UnknownRecord } from 'type-fest';

import { EFileType } from '#types/index.js';

export class Loader {
	private readonly JSON_BYTES = {
		UNIX: '7b0a',
		WINDOWS: '7b0d0a'
	};

	private readonly content: Buffer;

	public constructor (
		path: string
	) {
		this.content = readFileSync(path);
	}

	private isEnvFile (): boolean {
		const lines = this.content.toString('utf-8').split(/\r?\n/);

		for (const line of lines) {
			if (line.trim().startsWith('#') || line.trim() === String()) continue;

			if (!/^[A-Z0-9_]+=/.test(line.trim()))
				return false;
		}

		return true;
	}

	private determineFileType (): EFileType {
		const firstTwoBytes = this.content.subarray(0, 2).toString('hex');
		const firstThreeBytes = this.content.subarray(0, 3).toString('hex');

		if (firstTwoBytes === this.JSON_BYTES.UNIX || firstThreeBytes === this.JSON_BYTES.WINDOWS)
			return EFileType.JSON;

		if (this.isEnvFile())
			return EFileType.ENV;

		return EFileType.UNKNOWN;
	}

	private loadENV (): UnknownRecord {
		return this.content.toString('utf-8').split(/\r?\n/)
			.reduce((acc, line) => {
				if (line.trim().startsWith('#') || line.trim() === String()) return acc;

				const index = line.indexOf('=');
				const [ key, value ] = [
					line.substring(0, index).trim(),
					line.substring(index + 1).trim()
				];

				return { ...acc, [key]: value };
			}, {});
	}

	private loadJSON (): UnknownRecord {
		return JSON.parse(this.content.toString('utf-8'));
	}

	public load (): UnknownRecord {
		const filetype = this.determineFileType();

		switch (filetype) {
			case EFileType.ENV:
				return this.loadENV();
			case EFileType.JSON:
				return this.loadJSON();
			default:
				throw new Error('[LoaderError]: Unsupported file type.');
		}
	}
}