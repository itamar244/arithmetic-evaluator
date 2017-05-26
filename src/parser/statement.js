// @flow
import type { TreeItemType } from './types'
import * as tt from './types'
import UtilParser, { getMatch } from './util'
import Expression from './expression'
import isNotValidFunction from './../functions'
import { Node, ArgumentNode, OperatorNode } from './node'

type Options = {
	blob?: string,
	isNewTree?: bool,
	start?: number,
	end?: number
}

export default class Statement extends UtilParser {
	tree: Expression
	blob: string

	constructor(blob: string, params?: Set<string>) {
		super()

		this.tree = new Expression({ params })
		this.blob = blob

		this.parse()
	}

	parse({
		blob = this.blob,
		isNewTree = false,
		start = 0,
		end = blob.length - 1,
	}: Options = {}): Expression {
		const tree = isNewTree ? new Expression({ parent: this.tree }) : this.tree
		let pos = start

		while (pos <= end) {
			pos += this.nextNode(pos, blob, tree, pos === start)
		}

		return tree
	}

	nextNode(pos: number, blob: string, tree: Expression, firstItem: bool): number {
		if (blob[pos] === ' ') return getMatch(blob, /\s+/).length

		const { type, match } = this.inferTypeAndMatch(pos, blob)

		// if there now operator between two items, than a '*' operator will be added
		if (
			type !== tt.OPERATOR
			// could be bigger than 0, but it doesn't matter so this is faster
			&& tree.items.length > 1
			&& !(tree.get(-1) instanceof OperatorNode)
		) {
			tree.add(new OperatorNode(tt.OPERATOR, '*'))
		}

		tree.add(this.parseToItem(pos, type, match, tree.params, firstItem))

		// if there are two operators near each other
		if (type === tt.OPERATOR && tree.get(-2) instanceof OperatorNode) {
			this.unexpected('two operators can not be near each other')
		} else if (type === tt.PARAM && !tree.params.has(match)) {
			tree.params.add(match)
		}

		return type === tt.ERROR || tree.get(-1).type === tt.ERROR ? 1 : match.length
	}

	parseToItem(
		pos: number,
		type: TreeItemType,
		match: string,
		params: Set<string>,
		firstItem: bool,
	) {
		switch (type) {
			case tt.OPERATOR:
				return this.parseOperatorNode(type, match, pos, firstItem)
			case tt.NUMBER:
			case tt.CONSTANT:
			case tt.PARAM:
			case tt.ERROR:
				return new Node(type, match)
			case tt.FUNCTION:
				return this.parseFunction(type, match)
			case tt.ABS_BRACKETS:
				return this.parseAbsBrackets(type, match, pos)
			case tt.BRACKETS:
				return this.parseBrackets(type, match, pos)
			default:
				throw new Error(`${type} is not a valid type`)
		}
	}

	parseOperatorNode(type: TreeItemType, match: string, pos: number, firstItem: bool) {
		const op: OperatorNode = new OperatorNode(type, match)

		// + and - can be in pos 0
		if (firstItem && op.getOrder() !== 1) {
			this.unexpected(`${match} can't be the first operator`)
		}

		return op
	}

	parseFunction(type: TreeItemType, match: string): Node {
		const name = getMatch(match, /^[a-z]+/)
		const args = getMatch(match, /\(.+\)/)
			.slice(1, -1)
			.split(',')
			.map(blob => this.parse({ blob, isNewTree: true }).toArray())

		const isNotValid = isNotValidFunction(name, args)

		if (isNotValid) {
			this.unexpected(isNotValid)
		}

		return new ArgumentNode(type, name, args)
	}

	parseAbsBrackets(type: TreeItemType, match: string, pos: number): ArgumentNode {
		return new ArgumentNode(
			tt.FUNCTION,
			'abs',
			[this.parse({ start: pos + 1, end: pos + match.length - 2, isNewTree: true }).toArray()],
		)
	}

	parseBrackets(type: TreeItemType, match: string, pos: number): Expression {
		// slicing for removing the breckets from the string
		return this.parse({
			isNewTree: true,
			start: pos + 1,
			end: pos + match.length - 2,
		})
	}
}
