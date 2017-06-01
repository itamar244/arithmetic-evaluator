// @flow
import type {
	Location,
	NodeBase,
	BinNode,
	Node as NodeType,
} from '../types'
import * as tt from '../tokenizer/types'
import { orderPosition } from '../operators'

export default class Node implements NodeBase {
	type: any
	loc: Location
	raw: string

	constructor(type: string, raw: string, start: number): * {
		this.type = type
		this.raw = raw
		this.loc = {
			start,
			end: start + raw.length,
		}
	}
}

/* eslint-disable no-underscore-dangle, no-param-reassign */
export const getNodeOrder = (node: BinNode): number => {
	if (node.__orderPosition === undefined) {
		node.__orderPosition = orderPosition(node.raw)
	}

	return node.__orderPosition
}
/* eslint-enable no-underscore-dangle, no-param-reassign */

export const getBinNodeDeepSide = <T: NodeType>(node: T, side: 'left' | 'right'): T => (
	node.type === tt.BIN_OPERATOR
	? node[side] && getBinNodeDeepSide(node[side], side) || node
	: node
)
