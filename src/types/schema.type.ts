import type { ICustomValidator } from '#types/custom-validator/custom-validator.interface.js';

export type TSchema = Record<string,
	| 'host'
	| 'port'
	| 'url'
	| 'email'
	| 'array'
	| 'array:separator=,'
	| 'ip'
	| 'ip4'
	| 'ip6'
	| 'string'
	| 'number'
	| 'boolean'
	| 'json'
	| ICustomValidator
>;
