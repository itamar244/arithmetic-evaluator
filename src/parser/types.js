// @flow
import { Node } from './node'

export const PARAM: 'PARAM' = 'PARAM'
export const NUMBER: 'NUMBER' = 'NUMBER'
export const OPERATOR: 'OPERATOR' = 'OPERATOR'
export const FUNCTION: 'FUNCTION' = 'FUNCTION'
export const BRACKETS: 'BRACKETS' = 'BRACKETS'
export const CONSTANT: 'CONSTANT' = 'CONSTANT'
export const ABS_BRACKETS: 'ABS_BRACKETS' = 'ABS_BRACKETS'
export const ERROR: 'ERROR' = 'ERROR'

export type TreeItemType =
	typeof PARAM
	| typeof NUMBER
	| typeof OPERATOR
	| typeof FUNCTION
	| typeof BRACKETS
	| typeof CONSTANT
	| typeof ABS_BRACKETS
	| typeof ERROR

export type TreeItem = Node|Tree
export type Tree = TreeItem[]
