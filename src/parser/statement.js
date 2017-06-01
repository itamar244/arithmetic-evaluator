// @flow
import * as N from '../types'
import * as tt from '../tokenizer/types'
import toTokens from '../tokenizer'
import type { Token } from '../tokenizer'
import { getMatch, get } from '../utils'
import Node from './node'
import pushItemToNode from './util'
import isNotValidFunction from '../functions'

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
				return this.parseFunction(token)
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

	createNode(token: Token): N.Node & { [string]: any } {
		return new Node(token.type, token.match, this.state.pos)
	}

	parseLiteral(token: Token) {
		const node: N.Literal = this.createNode(token)
		node.value = Number(node.raw)
		return node
	}

	parseBinOperator(token: Token) {
		const node: N.BinOperator = this.createNode(token)
		node.operator = node.raw
		// NOTE: because both are initialized to null this is faster
		// eslint-disable-next-line no-multi-assign
		node.left = node.right = null
		return node
	}

	parseBrackets(match: string) {
		return this.parse(toTokens(match), match)
	}

	parseAbsBrackets(token: Token) {
		const node: N.Function = this.createNode({
			type: tt.FUNCTION,
			match: token.match,
		})
		node.name = 'abs'
		node.arguments = [this.parseBrackets(token.match.slice(1, -1))]

		return node
	}

	parseFunction(token: Token) {
		const node: N.Function = this.createNode(token)

		node.name = getMatch(token.match, /[a-z]+/)
		node.arguments =
			token.match.replace(node.name, '')
			.slice(1, -1)
			.split(',')
			.map(str => this.parseBrackets(str))

		const isNotValid = isNotValidFunction(node.name, node.arguments)

		if (isNotValid) {
			this.state.errors.push(this.createNode({
				type: tt.ERROR,
				match: isNotValid,
			}))
		}

		return node
	}

	parseNamedNode(token: Token) {
		const node: N.NamedNode = this.createNode(token)
		node.name = token.match
		return node
	}

	parseParam(token: Token) {
		const node = this.parseNamedNode(token)
		this.state.params.add(node.name)
		return node
	}
}
