// @flow
import type { TreeItemType } from './types'
import * as t from './types'
import UtilParser  from './util'
import Expression from './expression'
import { isNotValidFunction } from './../functions'
import { Node, ArgumentNode } from './node'

export default class Parser extends UtilParser {
	tree: Expression
	expr: string

	constructor(expression: string) {
		super()

		this.tree = new Expression()
		this.expr = expression
	}

	parse(expr?: string) {
		const tree = expr ? new Expression(this.tree.params) : this.tree
		let pos = 0

		expr = expr || this.expr

		while (pos < expr.length) {
			pos += this.nextToken(pos, expr, tree)
		}

		return tree
	}

	nextToken(pos: number, expr: string, tree: Expression): number {
		if (pos >= expr.length) {
			return 0
		}

		if (this.expr[pos] === ' ') {
			return this.getMatch(expr.slice(pos), /^\s+/).length
		}

		const { type, match } = this.inferTypeAndMatch(expr.slice(pos))

		const node1 = tree.get(-1)
		// if there now operator between two items, than a '*' operator will be added
		if (type !== t.OPERATOR && node1 instanceof Node && !node1.is(t.OPERATOR)) {
			tree.add(new Node(t.OPERATOR,'*'))
		}

		tree.add(this.parseMatch(type, match, tree.params))

		const node2 = tree.get(-2)
		// if there are two operators near each other
		if (type === t.OPERATOR && node2 instanceof Node && node2.is(t.OPERATOR)) {
			tree.add(new Node(t.ERROR, 'two operators can not be near each other'))
		} else if (type === t.PARAM && !tree.params.has(match)) {
			tree.params.add(match)
		}

		return tree.get(-1).type === t.ERROR ? 1 : match.length
	}

	parseMatch(type: TreeItemType, match: string, params: Set<string>) {
		switch (type) {
			case t.OPERATOR:
			case t.NUMBER:
			case t.CONSTANT:
			case t.PARAM:
			case t.ERROR:
				return this.parseNoramlNode(type, match)
			case t.FUNCTION:
				return this.parseFunction(type, match)
			case t.ABS_BRACKETS:
				return this.parseAbsBrackets(type, match, params)
			case t.BRACKETS:
				return this.parseBrackets(type, match, params)
			default:
				throw Error(`${type} is not a valid type`)
		}
	}

	parseNoramlNode(type: TreeItemType, match: string): Node {
		return new Node(type, match)
	}

	parseFunction(type: TreeItemType, match: string): Node {
		const name = this.getMatch(match, /^[a-z]+/)
		const args = this.getMatch(match, /\(.+\)/)
			.slice(1, -1)
			.split(',')
			.map(str => this.parse(str).toArray())

		const isNotValid = isNotValidFunction(name, args)

		return (
			isNotValid
			? new Node(t.ERROR, isNotValid)
			: new ArgumentNode(type, name, args)
		)
	}

	parseAbsBrackets(type: TreeItemType, match: string): ArgumentNode {
		return new ArgumentNode(
			t.FUNCTION,
			'abs',
			// this will auto set params thanks to mutable params usage
			[this.parse(match.slice(1, match.length - 1)).toArray()]
		)
	}

	parseBrackets(type: TreeItemType, match: string): Expression {
		// slicing for removing the breckets from the string
		return this.parse(match.slice(1, match.length - 1))
	}
}
