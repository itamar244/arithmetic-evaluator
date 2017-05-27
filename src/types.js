// @flow
type BinOperatorName = string

export type Location = {
	start: number,
	end: number,
}

export interface NodeBase {
	loc: Location,
	raw: string,
}

export type Node = NodeBase & { [string]: any }

export type Expression = NodeBase & {
	type: 'EXPRESSION',
	body: Node,
}

export type BinOperator = NodeBase & {
	type: 'BIN_OPERATOR',
	operator: BinOperatorName,
	left: Node,
	right: Node,
}

export type Literal = NodeBase & {
	type: 'LITERAL',
	value: number
}

export type Function = NodeBase & {
	type: 'FUNCTION',
	name: string,
	arguments: Node[],
}

export type Constant = NodeBase & {
	type: 'CONSTANT',
	name: string,
}
