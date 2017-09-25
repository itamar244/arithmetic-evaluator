// @flow
export type Params = { [string]: ?Node }

export type Location = {
	start: number;
	end: number;
}

export interface NodeBase {
	loc: Location;
}

export type AnyNode = NodeBase & { [string]: any }
export type Node =
	| Program
	| Expression
	| UnaryExpression
	| BinaryExpression
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
	| 'UnaryExpression'
	| 'BinaryExpression'
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


export type UnaryExpression = NodeBase & {
	type: 'UnaryExpression';
	operator: UnaryOperator;
	argument: Node;
	prefix: bool;
}

export type UnaryOperator =
	| '+'
	| '-'
	| '!'

type BinNode = NodeBase & {
	left: Node;
	right: Node;
}

export type BinaryExpression = BinNode & {
	type: 'BinaryExpression';
	operator: BinaryOperator;
}

export type BinaryOperator =
	| '+'
	| '-'
	| '*'
	| '/'
	| '^'
	| '%'

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
