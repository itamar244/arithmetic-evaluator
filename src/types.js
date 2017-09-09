// @flow
export type Location = {
	start: number;
	end: number;
}

export interface NodeBase {
	loc: Location;
	raw: string;
}

export type Node =
	Expression
	| UnaryOperator
	| BinOperator
	| Literal
	| FunctionNode
	| NamedNode
	| NonParsable

export type Result = NodeBase & {
	type: 'RESULT';
	expression: Expression;
	params: string[];
}

export type Expression = NodeBase & {
	type: 'EXPRESSION';
	body: Node;
}

export type Operator = NodeBase & {
	operator: string;
	__orderPosition?: number;
}

export type UnaryOperator = Operator & {
	type: 'UNARY_OPERATOR';
	argument: Node;
	prefix: bool;
}

export type BinOperator = Operator & {
	type: 'BIN_OPERATOR';
	left: Node;
	right: Node;
}

export type Literal = NodeBase & {
	type: 'LITERAL';
	value: number
}

type FunctionNode = NodeBase & {
	type: 'FUNCTION';
	name: string;
	args: Node[];
}
// there is some problem with built-in Function class; so this fixes it
// eslint-disable-next-line import/prefer-default-export
export type { FunctionNode as Function }

export type NamedNode = Constant | Parameter

export type Constant = NodeBase & {
	type: 'CONSTANT';
	name: string;
}

export type Parameter = NodeBase & {
	type: 'PARAM';
	name: string;
}

export type NonParsable = NodeBase & {
	type: 'NONPARSABLE'
}
