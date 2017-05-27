import type {
	Location,
	NodeBase,
	BinOperator,
	Node as NodeType,
} from '../types'
import { orderPosition } from '../operators'
import * as tt from '../tokenizer/types'
import { has } from '../utils'

export default class Node implements NodeBase {
	type: string
	loc: Location
	raw: string
	orderPosition: number | null = null

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
		if (this.orderPosition === null) {
			this.orderPosition = orderPosition(this.raw)
		}

		return this.orderPosition
	}

	is(type: string) {
		return type === this.type
	}

	clone(): Node {
		const node = new Node(this.type, this.raw, this.loc.start)

		for (const key in this) {
			if (has(this, key)) {
				// $FlowIgnore
				node[key] = this[key]
			}
		}

		return node
	}

	set(key: string, val: *) {
		// $FlowIgnore
		this[key] = val
		return this
	}
}


export class BinOperatorNode extends Node implements BinOperator {
	right: Node
	left: Node
}
