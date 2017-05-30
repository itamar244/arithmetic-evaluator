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
		const tree: N.Expression = new Node('EXPRESSION', blob, this.state.pos)
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
			const multi = this.parseToken({
				type: tt.BIN_OPERATOR,
				match: '*',
			})

			// eslint-disable-next-line no-param-reassign
			tree.body = pushItemToNode(multi, tree.body)
		}

		// eslint-disable-next-line no-param-reassign
		tree.body = pushItemToNode(node, tree.body)

		return token.match.length
	}

	parseToken(token: Token) {
		switch (token.type) {
			case tt.LITERAL:
				return this.parseLiteral(token)
			case tt.BIN_OPERATOR:
				return this.parseBinOperator(token)
			case tt.BRACKETS:
				return this.parseBrackets(token.match.slice(1, -1))
			case tt.ABS_BRACKETS:
				return this.parseAbsBrackets(token)
			case tt.FUNCTION:
				return this.parseFunction(token.match)
			case tt.CONSTANT:
				return this.parseNamedNode(token)
			case tt.PARAM:
				return this.parseParam(token)
			default:
				this.state.errors.push(
					token.type === tt.ERROR
					? new Node(token.type, `${token.match}: not a valid token`, this.state.pos)
					: new Node(tt.ERROR, `${token.type}: wrong type`, this.state.pos),
				)
		}

		return get(this.state.errors, -1)
	}

	parseLiteral(token: Token) {
		const node: N.Literal = new Node(token.type, token.match, this.state.pos)
		node.value = Number(node.raw)
		return node
	}

	parseBinOperator(token: Token) {
		const node: N.BinOperator = new Node(token.type, token.match, this.state.pos)
		node.operator = node.raw
		return node
	}

	parseBrackets(match: string) {
		return this.parse(toTokens(match), match)
	}

	parseAbsBrackets(token: Token) {
		const node: N.Function = new Node(tt.FUNCTION, token.match, this.state.pos)
		node.name = 'abs'
		node.arguments = [this.parseBrackets(token.match.slice(1, -1))]

		return node
	}

	parseFunction(match: string) {
		const node: N.Function = new Node(tt.FUNCTION, match, this.state.pos)

		node.name = getMatch(match, /[a-z]+/)
		node.arguments = getMatch(match, /\(.+\)/)
			.slice(1, -1)
			.split(',')
			.map(str => this.parseBrackets(str))

		return node
	}

	parseNamedNode(token: Token) {
		const node: N.NamedNode = new Node(token.type, token.match, this.state.pos)
		node.name = token.match
		return node
	}

	parseParam(token: Token) {
		const node = this.parseNamedNode(token)
		this.state.params.add(node.name)
		return node
	}
}
