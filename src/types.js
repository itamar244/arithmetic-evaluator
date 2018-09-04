// @flow
import type { SourceLocation } from './utils/location'

export interface NodeBase {
	loc: SourceLocation;
	start: number;
	end: number;
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
	| ConstLiteral
	| FunctionDeclaration
	| ParameterDeclaration
	| Equation
	| NumericLiteral
	| Identifier
	| Parenthesized
	| CallExpression
	| VectorExpression

export type Statement =
	| Expression
	| Import
	| VariableDeclerations
	| FunctionDeclaration
	| ParameterDeclaration

export type NodeType =
	| 'Program'
	| 'Expression'
	| 'Import'
	| 'UnaryExpression'
	| 'BinaryExpression'
	| 'VariableDeclerations'
	| 'VariableDeclerator'
	| 'ConstLiteral'
	| 'FunctionDeclaration'
	| 'ParameterDeclaration'
	| 'Equation'
	| 'NumericLiteral'
	| 'Identifier'
	| 'Parenthesized'
	| 'CallExpression'
	| 'VectorExpression'

export type Program = NodeBase & {
	type: 'Program';
	body: Statement[];
	filename: string;
}

export type Expression = NodeBase & {
	type: 'Expression';
	body: Node;
}

export type Import = NodeBase & {
	type: 'Import';
	path: string;
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

interface type = NodeBas & {
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

export type ConstLiteral = NodeBase & {
	type: 'ConstLiteral';
	// should be all legal names of const literals
	name: 'null' | 'inf';
}

export type FunctionDeclaration = NodeBase & {
	type: 'FunctionDeclaration';
	typeDefinitions: Identifier[] | null;
	params: ParameterDeclaration[];
	id: Identifier;
	body: Node;
}

export type ParameterDeclaration = NodeBase & {
	type: 'ParameterDeclaration';
	id: Identifier;
	declType: Identifier | null;
}

export type Equation = BinNode & {
	type: 'Equation';
}

export type NumericLiteral = NodeBase & {
	type: 'NumericLiteral';
	value: number;
}

export type Identifier = NodeBase & {
	type: 'Identifier';
	name: string;
}

export type Parenthesized = NodeBase & {
	type: 'Parenthesized';
	body: Node;
	abs: bool;
}

export type CallExpression = NodeBase & {
	type: 'CallExpression';
	callee: Identifier;
	typeArgs: Identifier[] | null;
	args: Node[];
}

export type VectorExpression = NodeBase & {
	type: 'VectorExpression';
	x: Node;
	y: Node;
}
