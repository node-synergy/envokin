import assert from 'node:assert';
import { join, resolve } from 'node:path';
import { describe, test } from 'node:test';

import dotenv from 'dotenv';
import type { UnknownRecord } from 'type-fest';

import { SchemaValidator, type TSchema, ValidationError } from '#lib/index.js';

import jsonConfig from './mocks/config.json' assert { type: 'json' };

function runCommonTests (
	validator: SchemaValidator,
	data: UnknownRecord,
	expected: UnknownRecord,
	strict: boolean
): void {
	test('SchemaValidator should validate and transform correctly', () => {
		const result = validator.validateAndTransform(data);
		assert.deepStrictEqual(result, expected);
	});

	test('SchemaValidator should throw ValidationError for invalid host', () => {
		assert.throws(() => {
			validator.validateAndTransform({ ...data, TEST_HOST: 'error' });
		}, ValidationError);
	});

	test('SchemaValidator should throw ValidationError for invalid port', () => {
		assert.throws(() => {
			validator.validateAndTransform({ ...data, TEST_PORT: 'error' });
		}, ValidationError);
	});

	test('SchemaValidator should throw ValidationError for invalid url', () => {
		assert.throws(() => {
			validator.validateAndTransform({ ...data, TEST_URL: 'error' });
		}, ValidationError);
	});

	test('SchemaValidator should throw ValidationError for invalid email', () => {
		assert.throws(() => {
			validator.validateAndTransform({ ...data, TEST_EMAIL: 'error' });
		}, ValidationError);
	});

	test('SchemaValidator should throw ValidationError for invalid array', () => {
		assert.throws(() => {
			validator.validateAndTransform({ ...data, TEST_ARRAY: {} });
		}, ValidationError);
	});

	test('SchemaValidator should throw ValidationError for invalid ip', () => {
		assert.throws(() => {
			validator.validateAndTransform({ ...data, TEST_IP: 'error' });
		}, ValidationError);
	});

	test('SchemaValidator should throw ValidationError for invalid ip4', () => {
		assert.throws(() => {
			validator.validateAndTransform({ ...data, TEST_IP4: 'error' });
		}, ValidationError);
	});

	test('SchemaValidator should throw ValidationError for invalid ip6', () => {
		assert.throws(() => {
			validator.validateAndTransform({ ...data, TEST_IP6: 'error' });
		}, ValidationError);
	});

	test('SchemaValidator should throw ValidationError for invalid string', () => {
		assert.throws(() => {
			validator.validateAndTransform({ ...data, TEST_STRING: true });
		}, ValidationError);
	});

	test('SchemaValidator should throw ValidationError for invalid number', () => {
		assert.throws(() => {
			validator.validateAndTransform({ ...data, TEST_NUMBER: 'error' });
		}, ValidationError);
	});

	test('SchemaValidator should throw ValidationError for invalid boolean', () => {
		assert.throws(() => {
			validator.validateAndTransform({ ...data, TEST_BOOLEAN: 'error' });
		}, ValidationError);
	});

	test('SchemaValidator should throw ValidationError for invalid json', () => {
		assert.throws(() => {
			validator.validateAndTransform({ ...data, TEST_JSON: 'error' });
		}, ValidationError);
	});

	if (strict) {
		test('SchemaValidator should throw ValidationError in strict mode for undefined value', () => {
			assert.throws(() => {
				validator.validateAndTransform({ ...data, TEST_HOST: undefined });
			}, ValidationError);
		});
	} else {
		test('SchemaValidator should handle non-strict mode correctly', () => {
			const result = validator.validateAndTransform({ ...data, TEST_HOST: undefined });
			const { TEST_HOST: _, ...rest } = expected;
			assert.deepStrictEqual(result, rest);
		});
	}
}

describe('SchemaValidator', () => {
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
			validator: (_: string, value: unknown): boolean => typeof value === 'string',
			transformer: (value: unknown): string => String(value).toUpperCase()
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
		CUSTOM_VALUE: 'HELLO'
	};

	const envSchema: TSchema = {
		...schema,
		TEST_ARRAY: 'array:separator=,'
	};

	const jsonSchema: TSchema = {
		...schema,
		TEST_ARRAY: 'array'
	};

	describe('ENV file schema validator', () => {
		const environment = dotenv.config({ path: resolve(join('tests', 'mocks', 'config.env')) }).parsed as UnknownRecord;

		describe('strict mode', () => {
			const strictValidator = new SchemaValidator(envSchema, true);
			runCommonTests(strictValidator, environment, expected, true);
		});

		describe('non-strict mode', () => {
			const nonStrictValidator = new SchemaValidator(envSchema);
			runCommonTests(nonStrictValidator, environment, expected, false);
		});
	});

	describe('JSON file schema validator', () => {
		describe('strict mode', () => {
			const strictValidator = new SchemaValidator(jsonSchema, true);
			runCommonTests(strictValidator, jsonConfig, expected, true);
		});

		describe('non-strict mode', () => {
			const nonStrictValidator = new SchemaValidator(jsonSchema);
			runCommonTests(nonStrictValidator, jsonConfig, expected, false);
		});
	});
});