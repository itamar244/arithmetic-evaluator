// @flow
import * as tt from './types'
import { Node, OperatorNode } from './node'
import type { Tree } from './types'
import { get } from '../utils'

type ExprssionItem = Node|Expression

export default class Expression {
	// #private
	items: ExprssionItem[] = []
	operators: OperatorNode[] = []
	lastWrap: number|null = null

	// #public
	hasError: bool = false
	params: Set<string>

	constructor(parentParams?: Set<string>, ...args: ExprssionItem[]) {
		this.params = parentParams || new Set()

		this.add(...args)
	}

	/* checks if operators need to be wrapped by brackets because order of operators */
	// #private
	checkOperatorsOrder() {
		/* if there less than two operators this check is useless
		 * or if last item is the last operator,
		 * than needs the next item to see what will be need to move into a smaller scope */
		if (this.operators.length < 2 || this.getOperator(-1).equals(this.get(-1))) {
			return
		}

		const lastOp = this.getOperator(-1)

		// if there was a wrapping in the previous time, than it will check operation against the inside wrapper brackets
		// this happend in the following scenarios: num + num * num ^ num
		if (this.lastWrap === this.items.length - 3) {
			const insideTree = this.get(-3)

			// actualy, it must be true because it was generated in this method earlier
			if (insideTree instanceof Expression) {
				const insideLastOp = insideTree.get(-2)

				if (
					insideLastOp instanceof OperatorNode // must be true also
					&& insideLastOp.getOrder() >= lastOp.getOrder()
				) {
					insideTree.add(...this.remove(2)[1])
				}
			}

		// if needs to be wrapped with brackets
		} else if (this.getOperator(-2).getOrder() > lastOp.getOrder()) {
			const [items, remove] = this.remove(3)

			// setting lastwrap to current location
			this.lastWrap = items.length
			this.items = [...items, new Expression(this.params, ...remove)]
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
				}
			}

			this.items.push(val)

			this.checkOperatorsOrder()
		})
	}

	remove(i: number = 1): [ExprssionItem[], ExprssionItem[]] {
		const removePart = this.items.slice(-i)

		this.operators = this.operators.filter(operator => (
			!removePart.some(item => operator === item)
		))
		this.items = this.items.slice(0, -i)

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
