// @flow
import type { SourceLocation } from './utils/location'

export interface NodeBase {
	loc: SourceLocation,
	start: number,
	end: number,
}

export type AnyNode = NodeBase & { [string]: any }
export type Node =
	| Program
	| Expression
	| Import
	| UnaryExpression
	| BinaryExpression
	| VariableDeclerations
	| VariableDeclerator
	| FunctionDeclaration
	| Equation
	| NumericLiteral
	| Identifier
	| AbsParentheses
	| CallExpression

export type Statement =
	| Expression
	| Import
	| VariableDeclerations
	| FunctionDeclaration

export type NodeType =
	| 'Program'
	| 'Expression'
	| 'Import'
	| 'UnaryExpression'
	| 'BinaryExpression'
	| 'VariableDeclerations'
	| 'VariableDeclerator'
	| 'FunctionDeclaration'
	| 'Equation'
	| 'NumericLiteral'
	| 'Identifier'
	| 'AbsParentheses'
	| 'CallExpression'

export type Program = NodeBase & {
	type: 'Program',
	body: Statement[],
	filename: string,
}

export type Expression = NodeBase & {
	type: 'Expression',
	body: Node,
}

export type Import = NodeBase & {
	type: 'Import',
	path: string,
}

export type UnaryExpression = NodeBase & {
	type: 'UnaryExpression',
	operator: UnaryOperator,
	argument: Node,
	prefix: bool,
}

export type UnaryOperator =
	| '+'
	| '-'
	| '!'

type BinNode = NodeBase & {
	left: Node,
	right: Node,
}

export type BinaryExpression = BinNode & {
	type: 'BinaryExpression',
	operator: BinaryOperator,
}

export type BinaryOperator =
	| '+'
	| '-'
	| '*'
	| '/'
	| '^'
	| '%'

export type VariableDeclerations = NodeBase & {
	type: 'VariableDeclerations',
	declarations: VariableDeclerator[],
	expression: Expression,
}

export type VariableDeclerator = NodeBase & {
	type: 'VariableDeclerator',
	id: Identifier,
	init: Node,
}

export type FunctionDeclaration = NodeBase & {
	type: 'FunctionDeclaration',
	params: Identifier[],
	id: Identifier,
	body: Node,
}

export type Equation = BinNode & {
	type: 'Equation',
}

export type NumericLiteral = NodeBase & {
	type: 'NumericLiteral',
	value: number,
}

export type Identifier = NodeBase & {
	type: 'Identifier',
	name: string,
}

export type AbsParentheses = NodeBase & {
	type: 'AbsParentheses',
	body: Node,
}

export type CallExpression = NodeBase & {
	type: 'CallExpression',
	callee: Identifier,
	args: Array<Node>,
}
