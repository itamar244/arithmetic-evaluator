// @flow
import { Node } from './node'

export type TreeItemType =
	'PARAM'
	| 'NUMBER'
	| 'OPERATOR'
	| 'FUNCTION'
	| 'BRACKETS'
	| 'CONSTANT'
	| 'ABS_BRACKETS'
	| 'ERROR'

export const PARAM = 'PARAM';
export const NUMBER = 'NUMBER';
export const OPERATOR = 'OPERATOR';
export const FUNCTION = 'FUNCTION';
export const BRACKETS = 'BRACKETS';
export const CONSTANT = 'CONSTANT';
export const ABS_BRACKETS = 'ABS_BRACKETS';
export const ERROR = 'ERROR';

export type TreeItem = Node
export type Tree = Array<TreeItem | Tree>
