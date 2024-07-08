import assert from 'node:assert';
import { describe, test } from 'node:test';

import { ValidationError } from '#lib/index.js';

describe('ValidationError', () => {
	const error = new ValidationError('Test error message');

	test('ValidationError should be an instance of Error', () => {
		assert.ok(error instanceof Error);
	});

	test('ValidationError should have correct name', () => {
		assert.strictEqual(error.name, 'ValidationError');
	});

	test('ValidationError should have correct message', () => {
		assert.strictEqual(error.message, 'Test error message');
	});

	test('ValidationError should capture stack trace', () => {
		assert.ok(error.stack?.includes('ValidationError'));
	});
});
