import assert from 'node:assert';
import { join, resolve } from 'node:path';
import { describe, test } from 'node:test';

import dotenv from 'dotenv';

import { Loader } from '#lib/index.js';

import config from './mocks/config.json' assert { type: 'json' };

describe('Loader', () => {
	test('Loader should load JSON file correctly', () => {
		const json = new Loader(resolve(join('tests', 'mocks', 'config.json'))).load();

		assert.deepStrictEqual(json, config);
	});

	test('Loader should load ENV file correctly', () => {
		const path = resolve(join('tests', 'mocks', 'config.env'));

		const env = dotenv.config({ path }).parsed;
		const envokinEnv = new Loader(path).load();

		assert.deepStrictEqual(env, envokinEnv);
	});

	test('Loader should throw error for unsupported file type', () => {
		assert.throws(() => {
			new Loader(resolve(join('tests', 'mocks', 'config.js'))).load();
		}, /Unsupported file type/);
	});
});
