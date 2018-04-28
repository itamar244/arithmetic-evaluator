import { SourceLocation } from './utils/location'

export interface NodeBase {
	loc: SourceLocation;
	start: number;
	end: number;
}

export type AnyNode = NodeBase & any;
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
	prefix: boolean;
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

export interface ConstLiteral extends NodeBase {
	type: 'ConstLiteral';
	// should be all legal names of const literals
	name: 'null' | 'inf';
}

export interface FunctionDeclaration extends NodeBase {
	type: 'FunctionDeclaration';
	typeDefinitions: null | Identifier[];
	params: ParameterDeclaration[];
	id: Identifier;
	body: Node;
}

export interface ParameterDeclaration extends NodeBase {
	type: 'ParameterDeclaration';
	id: Identifier;
	declType: null | Identifier;
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

export interface Parenthesized extends NodeBase {
	type: 'Parenthesized';
	body: Node;
	abs: boolean;
}

export interface CallExpression extends NodeBase {
	type: 'CallExpression';
	callee: Identifier;
	typeArgs: null | Identifier[];
	args: Node[];
}

export interface VectorExpression extends NodeBase {
	type: 'VectorExpression';
	x: Node;
	y: Node;
}
