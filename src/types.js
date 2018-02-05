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

export interface Program extends NodeBase {
	type: 'Program';
	body: Statement[];
	filename: string;
}

export interface Expression extends NodeBase {
	type: 'Expression';
	body: Node;
}

export interface Import extends NodeBase {
	type: 'Import';
	path: string;
}

export interface UnaryExpression extends NodeBase {
	type: 'UnaryExpression';
	operator: UnaryOperator;
	argument: Node;
	prefix: bool;
}

export type UnaryOperator =
	| '+'
	| '-'
	| '!'

interface BinNode extends NodeBase {
	left: Node;
	right: Node;
}

export interface BinaryExpression extends BinNode {
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

export interface VariableDeclerations extends NodeBase {
	type: 'VariableDeclerations';
	declarations: VariableDeclerator[];
	expression: Expression;
}

export interface VariableDeclerator extends NodeBase {
	type: 'VariableDeclerator';
	id: Identifier;
	init: Node;
}

export interface FunctionDeclaration extends NodeBase {
	type: 'FunctionDeclaration';
	params: Identifier[];
	id: Identifier;
	body: Node;
}

export interface Equation extends BinNode {
	type: 'Equation';
}

export interface NumericLiteral extends NodeBase {
	type: 'NumericLiteral';
	value: number;
}

export interface Identifier extends NodeBase {
	type: 'Identifier';
	name: string;
}

export interface AbsParentheses extends NodeBase {
	type: 'AbsParentheses';
	body: Node;
}

export interface CallExpression extends NodeBase {
	type: 'CallExpression';
	callee: Identifier;
	args: Node[];
}
