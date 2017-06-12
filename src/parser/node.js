// @flow
import type {
	Location,
	NodeBase,
	BinNode,
	Node as NodeType,
} from '../types'
import { BIN_OPERATOR } from '../tokenizer/types'
import { orderPosition } from '../operators'

export default class Node implements NodeBase {
	type: any
	loc: Location
	raw: string

	constructor(type: string, raw: string, start: number) {
		this.type = type
		this.raw = raw
		this.loc = {
			start,
			end: start + raw.length,
		}
	}
}

export const getNodeOrder = (node: BinNode): number => (
	// eslint-disable-next-line no-underscore-dangle, no-param-reassign
	node.__orderPosition || (node.__orderPosition = orderPosition(node.raw))
)

export const getBinNodeSideDeep = <T: NodeType>(node: T, side: 'left' | 'right'): T => (
	node.type === BIN_OPERATOR && node[side]
	? getBinNodeSideDeep(node[side], side)
	: node
)
