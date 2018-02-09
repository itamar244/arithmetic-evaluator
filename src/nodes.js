// @flow
import type { SourceLocation } from './utils/location'

export class NodeBase {
	loc: SourceLocation
}

export type Node =
	| Program
	| Expression
	| Import
	| UnaryExpression
	| BinaryExpression
	| VariableDeclerations
	| VariableDeclerator
	| FunctionDeclaration
	| NumericLiteral
	| Identifier
	| CallExpression

export type Statement =
	| Expression
	| Import
	| VariableDeclerations
	| FunctionDeclaration

export class Program extends NodeBase {
	type = 'Program'
	body: Statement[]
	filename: string

	constructor(body: Statement[], filename: string) {
		super()
		this.body = body
		this.filename = filename
	}
}

export class Expression extends NodeBase {
	type = 'Expression'
	body: Node
	// if the expression is absuolute parentheses
	isAbs: bool

	constructor(body: Node, isAbs: bool = false) {
		super()
		this.body = body
		this.isAbs = isAbs
	}
}

export class Import extends NodeBase {
	type = 'Import'
	path: string

	constructor(path: string) {
		super()
		this.path = path
	}
}

export type UnaryOperator =
	| '+'
	| '-'
	| '!'

export class UnaryExpression extends NodeBase {
	type = 'UnaryExpression'
	operator: UnaryOperator
	argument: Node
	prefix: bool

	constructor(operator: UnaryOperator, argument: Node, prefix: bool) {
		super()
		this.operator = operator
		this.argument = argument
		this.prefix = prefix
	}
}

export type BinaryOperator =
	| '+'
	| '-'
	| '*'
	| '/'
	| '^'
	| '%'

export class BinaryExpression extends NodeBase {
	type = 'BinaryExpression'
	left: Node
	right: Node
	operator: BinaryOperator

	constructor(operator: BinaryOperator, left: Node, right: Node) {
		super()
		this.left = left
		this.right = right
		this.operator = operator
	}
}

export class VariableDeclerations extends NodeBase {
	type = 'VariableDeclerations'
	declarations: VariableDeclerator[]
	expression: Expression

	constructor(declarations: VariableDeclerator[], expression: Expression) {
		super()
		this.declarations = declarations
		this.expression = expression
	}
}

export class VariableDeclerator extends NodeBase {
	type = 'VariableDeclerator'
	id: Identifier
	init: Node

	constructor(id: Identifier, init: Node) {
		super()
		this.id = id
		this.init = init
	}
}

export class FunctionDeclaration extends NodeBase {
	type = 'FunctionDeclaration'
	id: Identifier
	params: Identifier[]
	body: Node

	constructor(id: Identifier, params: Identifier[], body: Node) {
		super()
		this.id = id
		this.params = params
		this.body = body
	}
}

export class NumericLiteral extends NodeBase {
	type = 'NumericLiteral'
	value: number

	constructor(value: number) {
		super()
		this.value = value
	}
}

export class Identifier extends NodeBase {
	type = 'Identifier'
	name: string

	constructor(name: string) {
		super()
		this.name = name
	}
}

export class CallExpression extends NodeBase {
	type = 'CallExpression'
	callee: Identifier
	args: Node[]

	constructor(callee: Identifier, args: Node[]) {
		super()
		this.callee = callee
		this.args = args
	}
}
