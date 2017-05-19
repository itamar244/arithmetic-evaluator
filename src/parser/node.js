// @flow
import type {
	Tree,
	TreeItemType,
} from './types'
import { PARAM } from './types'
import typeof Expression from './expression'

export class Node {
	+type: TreeItemType
	+value: string
	+args: mixed

	constructor(type: typeof self.type, value: mixed) {
		// $FlowIgnore
		Object.assign(this, {
			type,
			value: String(value),
		})
	}

	is(type: TreeItemType): bool {
		return this.type === type;
	}

	equals(node: Node|mixed): bool {
		return (
			node instanceof Node
			&& this.type === node.type
			&& this.value === node.value
			&& this.args === node.args
		)
	}

	// clone(): Node {
	// 	return new Node(this.type, this.value)
	// }
	//
	// set(key: 'type' | 'value' | 'args', val: *): Node {
	// 	const clone = this.clone()
	// 	clone[key] = val
	// 	return clone
	// }
}

const searchParam = arr => arr.some(item => (
	item instanceof Array
	? searchParam(item)
	: item instanceof ArgumentNode
	? item.hasParams
	: item.is('PARAM')
))


export class ArgumentNode extends Node {
	+args: Tree[]
	+hasParams: bool

	constructor(type: typeof self.args, value: string, args: Tree[]) {
		super(type, value)

		// $FlowIgnore
		Object.assign(this, {
			args,
			hasParams: args.some(searchParam)
		})
	}

	// clone() {
	// 	return new ArgumentNode(this.type, this.value, this.args)
	// }
}
