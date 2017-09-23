// @flow
export const operator: 'operator' = 'operator'
export const eq: 'eq' = 'eq'
export const crotchet: 'crotchet' = 'crotchet'
export const comma: 'comma' = 'comma'
export const parenL: 'parenL' = 'parenL'
export const parenR: 'parenR' = 'parenR'
export const error: 'error' = 'error'
export const literal: 'literal' = 'literal'
export const identifier: 'identifier' = 'identifier'
export const eof: 'eof' = 'eof'

export const types = {
	operator,
	eq,
	crotchet,
	comma,
	parenL,
	parenR,
	error,
	literal,
	identifier,
	eof,
}

export type TokenType =
	typeof operator
	| typeof eq
	| typeof crotchet
	| typeof comma
	| typeof parenL
	| typeof parenR
	| typeof error
	| typeof literal
	| typeof identifier
	| typeof eof
