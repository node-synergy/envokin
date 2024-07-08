import type { TTransformer } from '#types/custom-validator/transformer.type.js';
import type { TValidator } from '#types/custom-validator/validator.type.js';

export interface ICustomValidator {
	validator: TValidator;
	transformer: TTransformer;
}
