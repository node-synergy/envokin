import eslint from '@eslint/js';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tslint from 'typescript-eslint';

export default tslint.config(
	eslint.configs.recommended,
	...tslint.configs.recommended,
	...tslint.configs.stylistic,
	{
		ignores: [ 'node_modules', 'lib' ],
		languageOptions: {
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				project: true,
				tsconfigRootDir: import.meta.dirname
			}
		},
		plugins: {
			'simple-import-sort': simpleImportSort
		},
		rules: {
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/explicit-function-return-type': 'error',
			'@typescript-eslint/explicit-member-accessibility': [
				'error',
				{
					'accessibility': 'explicit'
				}
			],
			'@typescript-eslint/explicit-module-boundary-types': 'error',
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-explicit-any': [
				'error',
				{
					ignoreRestArgs: true
				}
			],
			'@typescript-eslint/no-extra-semi': 'error',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_'
				}
			],
			'accessor-pairs': 'off',
			'array-bracket-spacing': [
				'error',
				'always',
				{
					singleValue: false,
					objectsInArrays: false,
					arraysInArrays: true
				}
			],
			'arrow-body-style': [ 'error', 'as-needed' ],
			'arrow-parens': [ 'error', 'as-needed' ],
			'arrow-spacing': [
				'error',
				{
					before: true,
					after: true
				}
			],
			'brace-style': [
				'error',
				'1tbs',
				{
					allowSingleLine: true
				}
			],
			'comma-dangle': [
				'error',
				{
					arrays: 'never',
					objects: 'never',
					imports: 'never',
					exports: 'never',
					functions: 'never'
				}
			],
			'comma-spacing': [
				'error',
				{
					before: false,
					after: true
				}
			],
			'comma-style': [ 'error', 'last' ],
			'computed-property-spacing': [
				'error',
				'never',
				{
					enforceForClassMembers: true
				}
			],
			'consistent-return': 'off',
			curly: [ 'error', 'multi-or-nest' ],
			'default-case': 'off',
			'default-case-last': 'error',
			'default-param-last': 'error',
			'dot-notation': 'off',
			'eol-last': [ 'error', 'never' ],
			eqeqeq: [ 'error', 'always' ],
			'func-call-spacing': [ 'error', 'never' ],
			'func-name-matching': 'error',
			'function-call-argument-newline': [ 'error', 'consistent' ],
			'grouped-accessor-pairs': 'error',
			indent: [
				'error',
				'tab',
				{
					SwitchCase: 1,
					outerIIFEBody: 1,
					MemberExpression: 1,
					FunctionDeclaration: {
						parameters: 'first',
						body: 1
					},
					ignoredNodes: [
						'FunctionExpression > .params[decorators.length > 0]',
						'FunctionExpression > .params > :matches(Decorator,:not(:first-child))',
						'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key'
					]
				}
			],
			'key-spacing': [
				'error',
				{
					beforeColon: false,
					afterColon: true,
					mode: 'strict'
				}
			],
			'keyword-spacing': [
				'error',
				{
					before: true,
					after: true
				}
			],
			'linebreak-style': [ 'error', 'unix' ],
			'lines-between-class-members': [
				'error',
				'always',
				{
					exceptAfterSingleLine: true
				}
			],
			'no-await-in-loop': 'error',
			'no-constructor-return': 'error',
			'no-duplicate-imports': [
				'error',
				{
					includeExports: true
				}
			],
			'no-global-assign': 'error',
			'no-irregular-whitespace': 'error',
			'no-mixed-spaces-and-tabs': 'error',
			'no-multi-spaces': 'error',
			'no-multiple-empty-lines': [
				'error',
				{
					max: 1
				}
			],
			'no-promise-executor-return': 'error',
			'no-return-assign': [ 'error', 'except-parens' ],
			'no-self-compare': 'error',
			'no-template-curly-in-string': 'error',
			'no-trailing-spaces': 'error',
			'no-unmodified-loop-condition': 'error',
			'no-unreachable-loop': 'error',
			'no-unused-private-class-members': 'error',
			'no-whitespace-before-property': 'error',
			'object-curly-newline': [
				'error',
				{
					multiline: true,
					consistent: true
				}
			],
			'object-curly-spacing': [ 'error', 'always' ],
			'object-property-newline': [
				'error',
				{
					allowMultiplePropertiesPerLine: true
				}
			],
			'object-shorthand': [ 'warn', 'properties' ],
			'padded-blocks': [ 'error', 'never' ],
			'prefer-arrow-callback': 'error',
			quotes: [ 'error', 'single' ],
			'rest-spread-spacing': [ 'error', 'never' ],
			semi: [ 'error', 'always' ],
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
			'space-before-function-paren': [
				'error',
				{
					anonymous: 'always',
					named: 'always',
					asyncArrow: 'always'
				}
			],
			'space-in-parens': [ 'error', 'never' ],
			yoda: [ 'error', 'never' ]
		}
	}
);
