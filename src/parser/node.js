import type {
	Location,
	NodeBase,
	BinOperator,
	Node as NodeType,
} from '../types'
import { orderPosition } from '../operators'
import * as tt from '../tokenizer/types'

export default class Node implements NodeBase {
	type: string
	loc: Location
	raw: string
	orderPosition: number | void

	constructor(type: string, raw: string, start: number): NodeType {
		this.type = type
		this.raw = raw
		this.loc = {
			start,
			end: start + raw.length,
		}
	}

	getOrder(): number {
		if (this.type !== tt.BIN_OPERATOR) {
			throw Error('can\'t get order on non operator item')
		}
		if (this.orderPosition === undefined) {
			this.orderPosition = orderPosition(this.raw)
		}

		return this.orderPosition
	}
}


export class BinOperatorNode extends Node implements BinOperator {
	right: Node
	left: Node
}
