import assert from 'node:assert';
import { join, resolve } from 'node:path';
import { describe, test } from 'node:test';

import dotenv from 'dotenv';
import type { UnknownRecord } from 'type-fest';

import { Envokin, type TSchema } from '#lib/index.js';

const schema: TSchema = {
	TEST_HOST: 'host',
	TEST_PORT: 'port',
	TEST_URL: 'url',
	TEST_EMAIL: 'email',
	TEST_IP: 'ip',
	TEST_IP4: 'ip4',
	TEST_IP6: 'ip6',
	TEST_STRING: 'string',
	TEST_NUMBER: 'number',
	TEST_BOOLEAN: 'boolean',
	TEST_JSON: 'json',
	CUSTOM_VALUE: {
		validator: (_: string, value: unknown) => typeof value === 'string',
		transformer: (value: unknown) => String(value).toUpperCase()
	}
};

const expected = {
	TEST_HOST: '0.0.0.0',
	TEST_PORT: 5000,
	TEST_URL: 'https://google.com',
	TEST_EMAIL: 'test@mail.com',
	TEST_ARRAY: [ 'VALUE1', 'VALUE2', 'VALUE3' ],
	TEST_IP: '0.0.0.0',
	TEST_IP4: '0.0.0.0',
	TEST_IP6: 'b560:d72d:b39d:b6bc:2303:f344:a643:820e',
	TEST_STRING: 'hello world',
	TEST_NUMBER: 9999,
	TEST_BOOLEAN: true,
	TEST_JSON: { hello: 'world' },
	CUSTOM_VALUE: 'HELLO',
	NODE_ENV: 'development'
};

describe('Envokin', () => {
	describe('Load from environment variables', () => {
		const envConfig = dotenv.config({ path: resolve(join('tests', 'mocks', 'config.env')) }).parsed as UnknownRecord;

		test('Should validate and transform environment variables', () => {
			const envokin = new Envokin(schema, { source: envConfig });
			assert.deepStrictEqual(envokin.get('TEST_HOST'), expected.TEST_HOST);
			assert.deepStrictEqual(envokin.get('TEST_PORT'), expected.TEST_PORT);
			assert.deepStrictEqual(envokin.get('TEST_URL'), expected.TEST_URL);
			assert.deepStrictEqual(envokin.get('TEST_EMAIL'), expected.TEST_EMAIL);
			assert.deepStrictEqual(envokin.get('TEST_IP'), expected.TEST_IP);
			assert.deepStrictEqual(envokin.get('TEST_IP4'), expected.TEST_IP4);
			assert.deepStrictEqual(envokin.get('TEST_IP6'), expected.TEST_IP6);
			assert.deepStrictEqual(envokin.get('TEST_STRING'), expected.TEST_STRING);
			assert.deepStrictEqual(envokin.get('TEST_NUMBER'), expected.TEST_NUMBER);
			assert.deepStrictEqual(envokin.get('TEST_BOOLEAN'), expected.TEST_BOOLEAN);
			assert.deepStrictEqual(envokin.get('TEST_JSON'), expected.TEST_JSON);
			assert.deepStrictEqual(envokin.get('CUSTOM_VALUE'), expected.CUSTOM_VALUE);
		});

		test('Should return correct environment mode', () => {
			const envokin = new Envokin(schema, { source: envConfig });
			assert.strictEqual(envokin.isDev, true);
			assert.strictEqual(envokin.isTest, false);
			assert.strictEqual(envokin.isProduction, false);
		});
	});

	describe('Load from JSON file', () => {
		const source = resolve(join('tests', 'mocks', 'config.json'));

		test('Should validate and transform JSON config', () => {
			const envokin = new Envokin(schema, { source });
			assert.deepStrictEqual(envokin.get('TEST_HOST'), expected.TEST_HOST);
			assert.deepStrictEqual(envokin.get('TEST_PORT'), expected.TEST_PORT);
			assert.deepStrictEqual(envokin.get('TEST_URL'), expected.TEST_URL);
			assert.deepStrictEqual(envokin.get('TEST_EMAIL'), expected.TEST_EMAIL);
			assert.deepStrictEqual(envokin.get('TEST_IP'), expected.TEST_IP);
			assert.deepStrictEqual(envokin.get('TEST_IP4'), expected.TEST_IP4);
			assert.deepStrictEqual(envokin.get('TEST_IP6'), expected.TEST_IP6);
			assert.deepStrictEqual(envokin.get('TEST_STRING'), expected.TEST_STRING);
			assert.deepStrictEqual(envokin.get('TEST_NUMBER'), expected.TEST_NUMBER);
			assert.deepStrictEqual(envokin.get('TEST_BOOLEAN'), expected.TEST_BOOLEAN);
			assert.deepStrictEqual(envokin.get('TEST_JSON'), expected.TEST_JSON);
			assert.deepStrictEqual(envokin.get('CUSTOM_VALUE'), expected.CUSTOM_VALUE);
		});

		test('Should return correct environment mode', () => {
			const envokin = new Envokin(schema, { source });
			assert.strictEqual(envokin.isDev, true);
			assert.strictEqual(envokin.isTest, false);
			assert.strictEqual(envokin.isProduction, false);
		});
	});
});