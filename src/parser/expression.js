// @flow
import * as tt from './types'
import { Node, OperatorNode } from './node'
import type { Tree } from './types'
import { get } from '../utils'

type ExprssionItem = Node|Expression

type Options = {|
	parent?: Expression,
	params?: Set<string>,
	children?: ExprssionItem[],
|}

export default class Expression {
	// #private
	operators: OperatorNode[] = []
	lastWrap: number|null = null

	// #public
	items: ExprssionItem[] = []
	hasError: bool = false
	params: Set<string>
	parent: Expression|null

	constructor({
		parent,
		params = parent ? parent.params : new Set(),
		children,
	}: Options = {}) {
		this.params = params
		this.parent = parent || null

		if (children) {
			this.add(...children)
		}
	}

	// #private
	/* checks if operators need to be wrapped by brackets because order of operators */
	checkOperatorsOrder() {
		/* if there less than two operators this check is useless
		 * or if last item is the last operator,
		 * than needs the next item to see what will be need to move into a smaller scope */
		if (this.operators.length < 2 || this.get(-1) instanceof OperatorNode) return

		const lastOpOrder = this.getOperator(-1).getOrder()

		// if needs to be wrapped with brackets
		if (lastOpOrder > this.getOperator(-2).getOrder()) {
			/* if there was a wrapping in the previous time,
			 * than it will check operation against the inside wrapper brackets
			 * this happend in the following scenarios: num + num * num ^ num */
			if (this.lastWrap === this.items.length - 3) {
				const insideTree = this.get(-3)

				// actualy, it must be true because it was generated in this method earlier
				if (
					insideTree instanceof Expression
					&& insideTree.getOperator(-1).getOrder() < lastOpOrder
				) {
					insideTree.add(...this.remove(2)[1])
					return
				}
			}

			const [items, remove] = this.remove(3)

			// setting lastwrap to current location
			this.lastWrap = items.length
			this.items = [
				...items,
				new Expression({
					parent: this,
					children: remove,
				}),
			]
		}
	}

	add(...vals: ExprssionItem[]) {
		vals.forEach((val) => {
			if (val instanceof Node) {
				if (val instanceof OperatorNode) {
					this.operators.push(val)
				} else if (val.is(tt.PARAM)) {
					this.params.add(val.value)
				} else if (!this.hasError && val.is(tt.ERROR)) {
					this.hasError = true
					if (this.parent) this.parent.hasError = true
				}
			}

			this.items.push(val)

			this.checkOperatorsOrder()
		})
	}

	remove(i: number = 1): [ExprssionItem[], ExprssionItem[]] {
		const removePart = this.items.slice(-i)

		this.items = this.items.slice(0, -i)

		// $FlowFixMe - flow can't tell that the filter method will return only OperatorNode[]
		this.operators = (this.items.filter(item => item instanceof OperatorNode): OperatorNode[])

		return [this.items, removePart]
	}

	toArray(): Tree {
		return this.items.map(item => (
			item instanceof Expression ? item.toArray() : item
		))
	}

	get(i: number): ExprssionItem {
		return get(this.items, i)
	}

	getOperator(i: number): OperatorNode {
		return get(this.operators, i)
	}
}
