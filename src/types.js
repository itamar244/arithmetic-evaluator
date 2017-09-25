// @flow
export type Params = { [string]: ?Node }

export type Location = {
	start: number;
	end: number;
}

export type NodeBase = {
	loc: Location;
}

export type AnyNode = NodeBase & { [string]: any }
export type Node =
	| Program
	| Expression
	| UnaryOperator
	| BinaryOperator
	| VariableDeclerations
	| VariableDeclerator
	| FunctionDeclaration
	| Equation
	| Literal
	| Identifier
	| AbsParentheses
	| CallExpression

export type Statement =
	| Expression
	| VariableDeclerations
	| FunctionDeclaration

export type NodeType =
	| 'Program'
	| 'Expression'
	| 'UnaryOperator'
	| 'BinaryOperator'
	| 'VariableDeclerations'
	| 'VariableDeclerator'
	| 'FunctionDeclaration'
	| 'Equation'
	| 'Literal'
	| 'Identifier'
	| 'AbsParentheses'
	| 'CallExpression'

export type Program = NodeBase & {
	type: 'Program';
	body: Statement[];
}

export type Expression = NodeBase & {
	type: 'Expression';
	body: Node;
}

export type Operator = NodeBase & {
	operator: string;
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

export type BinaryOperator = Operator & BinNode & {
	type: 'BinaryOperator';
}

export type VariableDeclerations = NodeBase & {
	type: 'VariableDeclerations';
	declarations: VariableDeclerator[];
	expression: Expression;
}

export type VariableDeclerator = NodeBase & {
	type: 'VariableDeclerator';
	id: Identifier;
	init: Node;
}

export type FunctionDeclaration = NodeBase & {
	type: 'FunctionDeclaration';
	params: Identifier[];
	id: Identifier;
	body: Node;
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
	body: Node;
}

export type CallExpression = NodeBase & {
	type: 'CallExpression';
	callee: Identifier;
	args: Array<Node>;
}
