// @flow
import * as N from '../types'
import * as tt from '../tokenizer/types'
import toTokens from '../tokenizer'
import type { Token } from '../tokenizer'
import { getMatch } from '../utils'
import Node from './node'
import pushItemToNode from './util'

type StatementState = {
	pos: number,
	errors: Array<{
		error: string,
		pos: number
	}>
}

export default class StatementParser {
	blob: string
	tokens: Token[]
	tree: N.Expression
	state: StatementState = {
		pos: 0,
		errors: [],
	}

	constructor(blob: string) {
		this.blob = blob

		this.tree = new Node('EXPRESSION', blob, this.state.pos)

		this.parse(toTokens(blob))
	}

	parse(tokens: Token[], tree: N.Expression = this.tree) {
		const start = this.state.pos
		for (const token of tokens) {
			this.state.pos += this.nextToken(token, tokens, tree)
		}

		this.state.pos = start

		return tree
	}

	nextToken(token: Token, tokens: Token[], tree: N.Expression) {
		if (this.state.pos >= this.blob.length) return 0

		const node = this.parseToken(token)

		// eslint-disable-next-line no-param-reassign
		tree.body = tree.body != null ? pushItemToNode(node, tree.body) : node

		return token.match.length
	}

	parseToken(token: Token): N.Node {
		switch (token.type) {
			case tt.LITERAL:
				return this.parseItem(token)
			case tt.BIN_OPERATOR:
				return this.parseBinOperator(token)
			case tt.BRACKETS:
				return this.parseBrackets(token.match.slice(1, -1))
			case tt.ABS_BRACKETS:
				return this.parseAbsBrackets(token)
			case tt.FUNCTION:
				return this.parseFunction(token.match)
			default:
				this.state.errors.push({
					error: `${token.type}: wrong type`,
					pos: this.state.pos,
				})
				return new Node(tt.ERROR, this.state.pos)
		}
	}

	parseItem(token: Token): N.Literal {
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
		return this.parse(
			toTokens(match),
			new Node('EXPRESSION', match, this.state.pos),
		)
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
}
