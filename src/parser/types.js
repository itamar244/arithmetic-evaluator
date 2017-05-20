// @flow
import { Node } from './node'

export const PARAM = 'PARAM';
export const NUMBER = 'NUMBER';
export const OPERATOR = 'OPERATOR';
export const FUNCTION = 'FUNCTION';
export const BRACKETS = 'BRACKETS';
export const CONSTANT = 'CONSTANT';
export const ABS_BRACKETS = 'ABS_BRACKETS';
export const ERROR = 'ERROR';

export type TreeItemType =
	typeof PARAM
	| typeof NUMBER
	| typeof OPERATOR
	| typeof FUNCTION
	| typeof BRACKETS
	| typeof CONSTANT
	| typeof ABS_BRACKETS
	| typeof ERROR

export type TreeItem = Node
export type Tree = Array<TreeItem | Tree>
