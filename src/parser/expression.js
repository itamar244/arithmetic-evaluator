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
	lastWrap: Expression|null = null

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
	/* checks if operators need to be wrapped by brackets because order of operators
	 * and wraps them out if needed */
	wrapItemsIfNeeded() {
		/* if there less than two operators this check is useless
		 * or if last item is the last operator,
		 * than needs the next item to see what will be need to move into a smaller scope */
		if (this.operators.length < 2 || this.get(-1) instanceof OperatorNode) return

		// if needs to be wrapped with brackets
		if (this.getOperator(-1).getOrder() > this.getOperator(-2).getOrder()) {
			/* if the last item which is not operator is the last wrap,
			 * the new items will go to the last wrap.
			 * this happend in the following scenarios: (num + num * num ^ num). */
			if (this.lastWrap && this.lastWrap === this.get(-3)) {
				this.lastWrap.add(...this.remove(2))
			} else {
				const remove = this.remove(3)

				this.lastWrap = new Expression({
					parent: this,
					children: remove,
				})

				this.items.push(this.lastWrap)
			}
		}
	}

	add(...vals: ExprssionItem[]) {
		for (const val of vals) {
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

			this.wrapItemsIfNeeded()
		}
	}

	remove(i: number = 1): ExprssionItem[] {
		const ret = this.items.splice(-i)
		// $FlowFixMe - flow can't tell that the filter method will return only OperatorNode[]
		this.operators = (this.items.filter(item => item instanceof OperatorNode): OperatorNode[])

		return ret
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
