// @flow
import type {
	Tree,
	TreeItemType,
} from './types'
import { PARAM } from './types'
import { orderPosition } from '../operators'

export class Node {
	+type: TreeItemType
	+value: string

	constructor(type: TreeItemType, value: mixed) {
		// $FlowIgnore
		Object.assign(this, {
			type,
			value: String(value),
		})
	}

	is(type: TreeItemType): bool {
		return this.type === type
	}
}

const searchParam = arr => arr.some(item => (
	item instanceof Array
	? searchParam(item)
	: item instanceof ArgumentNode
	? item.hasParams
	: item.is(PARAM)
))


export class ArgumentNode extends Node {
	+args: Tree[]
	hasParamsVal: bool|null = null

	constructor(type: TreeItemType, value: string, args: Tree[]) {
		super(type, value)

		// $FlowIgnore
		Object.assign(this, {
			args,
		})
	}

	hasParams(): bool {
		if (this.hasParamsVal === null) {
			this.hasParamsVal = this.args.some(searchParam)
		}

		return this.hasParamsVal
	}
}

export class OperatorNode extends Node {
	orderPosition: number|null = null

	getOrder(): number {
		if (this.orderPosition === null) {
			this.orderPosition = orderPosition(this.value)
		}

		return this.orderPosition
	}
}
