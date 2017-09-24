// @flow
type TokenTypeOptions = {
	binop?: number;
	prefix?: bool;
	postfix?: bool;
}

const prefix = true
const postfix = true

export class TokenType {
	label: string
	binop: number | null
	prefix: bool
	postfix: bool

	constructor(label: string, options: TokenTypeOptions = {}) {
		this.label = label
		this.binop = options.binop || null
		this.prefix = !!options.prefix
		this.postfix = !!options.postfix
	}
}

export class BinopTokenType extends TokenType {
	constructor(label: string, binop: number, options: TokenTypeOptions = {}) {
		options.binop = binop
		super(label, options)
	}
}

export const types = {
	literal: new TokenType('literal'),
	error: new TokenType('error'),
	identifier: new TokenType('identifier'),
	eof: new TokenType('eof'),
	eq: new TokenType('='),
	bang: new TokenType('!', { postfix }),
	crotchet: new TokenType('|'),
	comma: new TokenType(','),
	parenL: new TokenType('('),
	parenR: new TokenType(')'),

	plusMin: new BinopTokenType('+/-', 2, { prefix }),
	star: new BinopTokenType('*', 3),
	slash: new BinopTokenType('/', 3),
	modulo: new BinopTokenType('%', 3),
	exponent: new BinopTokenType('^', 4),
}
