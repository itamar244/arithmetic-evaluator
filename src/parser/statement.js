// @flow
import * as N from '../types'
import * as tt from '../tokenizer/types'
import toTokens from '../tokenizer'
import type { Token } from '../tokenizer'
import { getMatch, get } from '../utils'
import Node from './node'
import pushItemToNode from './util'

type StatementState = {
	pos: number,
	errors: N.Node[],
	params: Set<string>,
}

export default class StatementParser {
	blob: string
	tokens: Token[]
	trees: N.Expression[]
	state: StatementState = {
		pos: 0,
		errors: [],
		params: new Set(),
	}

	constructor(blob: string) {
		this.blob = blob

		const parts = blob.split('=')

		if (parts.length > 2) {
			this.state.errors.push(
				new Node(tt.ERROR, 'to many equal signs. need max of one sign', this.state.pos),
			)
		} else {
			this.trees = parts.map(part => (
				this.parse(
					toTokens(part),
					part,
				)
			))
		}
	}

	parse(tokens: Token[], blob: string) {
		const start = this.state.pos
		const tree = new Node('EXPRESSION', blob, this.state.pos)
		for (const token of tokens) {
			this.state.pos += this.nextToken(token, tree)
		}

		this.state.pos = start

		return tree
	}

	nextToken(token: Token, tree: N.Expression) {
		if (this.state.pos >= this.blob.length) return 0

		const node = this.parseToken(token)

		if (
			node.type !== tt.BIN_OPERATOR
			&& tree.body && tree.body.type !== tt.BIN_OPERATOR
		) {
			this.nextToken({
				type: tt.BIN_OPERATOR,
				match: '*',
			}, tree)
		}

		// eslint-disable-next-line no-param-reassign
		tree.body = tree.body != null ? pushItemToNode(node, tree.body) : node

		return token.match.length
	}

	parseToken(token: Token) {
		switch (token.type) {
			case tt.LITERAL:
				return this.parseLiteral(token)
			case tt.BIN_OPERATOR:
				return this.parseBinOperator(token)
			case tt.BRACKETS:
				return this.parseBrackets(token.match)
			case tt.ABS_BRACKETS:
				return this.parseAbsBrackets(token)
			case tt.FUNCTION:
				return this.parseFunction(token.match)
			case tt.CONSTANT:
				return this.parseNamedNode(token)
			case tt.PARAM:
				return this.parseParam(token)
			case tt.ERROR:
				this.state.errors.push(
					new Node(token.type, `${token.match}: not a valid token`, this.state.pos),
				)
				break
			default:
				this.state.errors.push(
					new Node(tt.ERROR, `${token.type}: wrong type`, this.state.pos),
				)
		}

		return get(this.state.errors, -1)
	}

	parseLiteral(token: Token): N.Literal {
		const node: N.Literal = new Node(token.type, token.match, this.state.pos)
		node.value = Number(node.raw)
		return node
	}

	parseBinOperator(token: Token): N.BinOperator {
		const node: N.BinOperator = new Node(token.type, token.match, this.state.pos)
		node.operator = node.raw
		return node
	}

	parseBrackets(match: string): N.Expression {
		return this.parse(toTokens(match.slice(1, -1)), match)
	}

	parseAbsBrackets(token: Token): N.Function {
		const node: N.Function = new Node(tt.FUNCTION, token.match, this.state.pos)
		node.name = 'abs'
		node.arguments = [this.parseBrackets(token.match)]

		return node
	}

	parseFunction(match: string): N.Function {
		const node: N.Function = new Node(tt.FUNCTION, match, this.state.pos)

		node.name = getMatch(match, /[a-z]+/)
		node.arguments = getMatch(match, /\(.+\)/)
			.slice(1, -1)
			.split(',')
			.map(str => this.parseBrackets(str))

		return node
	}

	parseNamedNode(token: Token): N.NamedNode {
		const node: N.NamedNode = new Node(token.type, token.match, this.state.pos)
		node.name = token.match
		return node
	}

	parseParam(token: Token): N.NamedNode {
		const node = this.parseNamedNode(token)
		this.state.params.add(node.name)
		return node
	}
}
