// @flow
import type { TreeItemType } from './types'
import * as tt from './types'
import UtilParser  from './util'
import Expression from './expression'
import { isNotValidFunction } from './../functions'
import {
	Node,
	ArgumentNode,
	OperatorNode,
} from './node'

export default class Statement extends UtilParser {
	tree: Expression
	blob: string

	constructor(blob: string, params?: Set<string>) {
		super()

		this.tree = new Expression(params)
		this.blob = blob

		this.parse()
	}

	parse(blob: string = this.blob, createNewTree: bool = false) {
		const tree = createNewTree ? new Expression(this.tree.params) : this.tree
		let pos = 0

		while (pos < blob.length) {
			pos += this.nextNode(pos, blob, tree)
		}

		return tree
	}

	nextNode(pos: number, blob: string, tree: Expression): number {
		if (pos >= blob.length) {
			return 0
		}

		if (this.blob[pos] === ' ') {
			return this.getMatch(blob.slice(pos), /^\s+/).length
		}

		const { type, match } = this.inferTypeAndMatch(pos, blob)

		// if there now operator between two items, than a '*' operator will be added
		if (
			type !== tt.OPERATOR
			// could be bigger than 0, but it doesn't matter so this is faster
			&& tree.length > 1
			&& !(tree.get(-1) instanceof OperatorNode)
		) {
			tree.add(new OperatorNode(tt.OPERATOR,'*'))
		}

		tree.add(this.parseToItem(pos, type, match, tree.params))

		// if there are two operators near each other
		if (type === tt.OPERATOR && tree.get(-2) instanceof OperatorNode) {
			this.unexpected('two operators can not be near each other')
		} else if (type === tt.PARAM && !tree.params.has(match)) {
			tree.params.add(match)
		}

		return type === tt.ERROR || tree.get(-1).type === tt.ERROR ? 1 : match.length
	}

	parseToItem(pos: number, type: TreeItemType, match: string, params: Set<string>) {
		switch (type) {
			case tt.OPERATOR:
				if (pos === 0) {
					this.unexpected('operator can not be the first item')
				}

				return this.parseOperatorNode(type, match)
			case tt.NUMBER:
			case tt.CONSTANT:
			case tt.PARAM:
			case tt.ERROR:
				return this.parseNode(type, match)
			case tt.FUNCTION:
				return this.parseFunction(type, match)
			case tt.ABS_BRACKETS:
				return this.parseAbsBrackets(type, match)
			case tt.BRACKETS:
				return this.parseBrackets(type, match)
			default:
				throw Error(`${type} is not a valid type`)
		}
	}

	parseNode(type: TreeItemType, match: string): Node {
		return new Node(type, match)
	}

	parseOperatorNode(type: TreeItemType, match: string) {
		return new OperatorNode(type, match)
	}

	parseFunction(type: TreeItemType, match: string): Node {
		const name = this.getMatch(match, /^[a-z]+/)
		const args = this.getMatch(match, /\(.+\)/)
			.slice(1, -1)
			.split(',')
			.map(str => this.parse(str, true).toArray())

		const isNotValid = isNotValidFunction(name, args)

		return (
			isNotValid
			? new Node(tt.ERROR, isNotValid)
			: new ArgumentNode(type, name, args)
		)
	}

	parseAbsBrackets(type: TreeItemType, match: string): ArgumentNode {
		return new ArgumentNode(
			tt.FUNCTION,
			'abs',
			// this will auto set params thanks to mutable params usage
			[this.parse(match.slice(1, match.length - 1), true).toArray()]
		)
	}

	parseBrackets(type: TreeItemType, match: string): Expression {
		// slicing for removing the breckets from the string
		return this.parse(match.slice(1, match.length - 1), true)
	}
}
