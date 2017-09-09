// @flow
export const ABS_BRACKETS: 'ABS_BRACKETS' = 'ABS_BRACKETS'
export const OPERATOR: 'OPERATOR' = 'OPERATOR'
export const BRACKETS: 'BRACKETS' = 'BRACKETS'
export const CONSTANT: 'CONSTANT' = 'CONSTANT'
export const ERROR: 'ERROR' = 'ERROR'
export const FUNCTION: 'FUNCTION' = 'FUNCTION'
export const LITERAL: 'LITERAL' = 'LITERAL'
export const PARAM: 'PARAM' = 'PARAM'

export type TokenType =
	typeof ABS_BRACKETS
	| typeof OPERATOR
	| typeof BRACKETS
	| typeof CONSTANT
	| typeof ERROR
	| typeof FUNCTION
	| typeof LITERAL
	| typeof PARAM

export type Token = {
	type: TokenType;
	match: string;
}
