// @flow
export type Location = {
	start: number;
	end: number;
}

export type NodeBase = {
	loc: Location;
}

export type AnyNode = NodeBase & { [string]: any }
export type Node =
	Result
	| Expression
	| UnaryOperator
	| BinOperator
	| Equation
	| Literal
	| Identifier
	| AbsParentheses
	| FunctionNode

export type NodeType =
	'Result'
	| 'Expression'
	| 'UnaryOperator'
	| 'BinaryOperator'
	| 'Equation'
	| 'Literal'
	| 'Identifier'
	| 'AbsParentheses'
	| 'Function'

export type Result = NodeBase & {
	type: 'Result';
	expression: Expression;
	identifiers: string[];
}

export type Expression = NodeBase & {
	type: 'Expression';
	body: ?Node;
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

type BinNode = {
	left: Node;
	right: Node;
}

export type BinOperator = Operator & BinNode & {
	type: 'BinaryOperator';
}

export type Equation = NodeBase & BinNode & {
	type: 'Equation'
}

export type Literal = NodeBase & {
	type: 'Literal';
	value: number
}

export type Identifier = NodeBase & {
	type: 'Identifier';
	name: string;
}

export type AbsParentheses = NodeBase & {
	type: 'AbsParentheses';
	body: ?Node;
}

type FunctionNode = NodeBase & {
	type: 'Function';
	callee: Identifier;
	args: Array<?Node>;
}
// there is some problem with built-in Function class; so this fixes it
// eslint-disable-next-line import/prefer-default-export
export type { FunctionNode as Function }
