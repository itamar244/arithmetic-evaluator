// @flow
type TokenTypeOptions = {
	binop?: number,
	prefix?: bool,
	postfix?: bool,
	afterOp?: bool,
}

const prefix = true
const postfix = true
const afterOp = true

export class TokenType {
	label: string
	binop: number | null
	prefix: bool
	postfix: bool
	afterOp: bool

	constructor(label: string, options: TokenTypeOptions = {}) {
		this.label = label
		this.binop = options.binop || null
		this.prefix = !!options.prefix
		this.postfix = !!options.postfix
		this.afterOp = !!options.afterOp
	}
}

export class BinopTokenType extends TokenType {
	constructor(label: string, binop: number, options: TokenTypeOptions = {}) {
		options.binop = binop
		super(label, options)
	}
}

export const keywords = {
	let: new TokenType('let'),
	in: new TokenType('in'),
	func: new TokenType('func'),
	import: new TokenType('import'),
}

export const types = {
	...keywords,
	num: new TokenType('num', { afterOp }),
	error: new TokenType('error'),
	string: new TokenType('string'),
	name: new TokenType('name', { afterOp }),
	eof: new TokenType('eof'),

	bang: new TokenType('!', { postfix }),
	crotchet: new TokenType('|'),
	comma: new TokenType(','),
	parenL: new TokenType('(', { afterOp }),
	parenR: new TokenType(')'),
	semi: new TokenType(';'),

	eq: new BinopTokenType('=', 1),
	plus: new BinopTokenType('+', 2, { prefix }),
	minus: new BinopTokenType('-', 2, { prefix }),
	star: new BinopTokenType('*', 3),
	slash: new BinopTokenType('/', 3),
	modulo: new BinopTokenType('%', 3),
	exponent: new BinopTokenType('^', 4),
}
