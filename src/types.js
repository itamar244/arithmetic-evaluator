// @flow
export type Location = {
	start: number;
	end: number;
}

export type NodeBase = {
	loc: Location;
	raw: string;
}

export type AnyNode = NodeBase & { [string]: any }
export type Node =
	Result
	| Expression
	| UnaryOperator
	| BinOperator
	| Literal
	| FunctionNode
	| NamedNode
	| NonParsable

export type NodeType =
	'Result'
	| 'Expression'
	| 'UnaryOperator'
	| 'BinaryOperator'
	| 'Literal'
	| 'Function'
	| 'Constant'
	| 'Identifier'
	| 'NonParsable'

export type Result = NodeBase & {
	type: 'Result';
	expression: Expression;
	params: string[];
	isEquation: bool;
}

export type Expression = NodeBase & {
	type: 'Expression';
	body: Node;
}

export type Operator = NodeBase & {
	operator: string;
	__prec?: number;
}

export type UnaryOperator = Operator & {
	type: 'UnaryOperator';
	argument: Node;
	prefix: bool;
}

type BinNode = Operator & {
	left: Node;
	right: Node;
}

export type BinOperator = BinNode & {
	type: 'BinaryOperator';
}

export type Literal = NodeBase & {
	type: 'Literal';
	value: number
}

type FunctionNode = NodeBase & {
	type: 'Function';
	name: string;
	args: Node[];
}
// there is some problem with built-in Function class; so this fixes it
// eslint-disable-next-line import/prefer-default-export
export type { FunctionNode as Function }

export type NamedNode = Constant | Identifier

export type Constant = NodeBase & {
	type: 'Constant';
	name: string;
}

export type Identifier = NodeBase & {
	type: 'Identifier';
	name: string;
}

export type NonParsable = NodeBase & {
	type: 'NonParsable'
}
