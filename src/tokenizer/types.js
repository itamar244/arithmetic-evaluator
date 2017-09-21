// @flow
export const OPERATOR: 'OPERATOR' = 'OPERATOR'
export const CROTCHET: 'CROTCHET' = 'CROTCHET'
export const COMMA: 'COMMA' = 'COMMA'
export const PAREN_L: 'PAREN_L' = 'PAREN_L'
export const PAREN_R: 'PAREN_R' = 'PAREN_R'
export const ERROR: 'ERROR' = 'ERROR'
export const FUNCTION: 'FUNCTION' = 'FUNCTION'
export const LITERAL: 'LITERAL' = 'LITERAL'
export const IDENTIFIER: 'IDENTIFIER' = 'IDENTIFIER'
export const EOF: 'EOF' = 'EOF'

export type TokenType =
	typeof OPERATOR
	| typeof CROTCHET
	| typeof COMMA
	| typeof PAREN_L
	| typeof PAREN_R
	| typeof ERROR
	| typeof FUNCTION
	| typeof LITERAL
	| typeof IDENTIFIER
	| typeof EOF

export type Token = {
	type: TokenType;
	start: number;
	end: number;
}
