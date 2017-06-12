// @flow
import * as N from '../types'
import * as tt from '../tokenizer/types'
import toTokens, { type Token } from '../tokenizer'
import { getMatch } from '../utils'
import Node, { getNodeOrder } from './node'
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
		const tree: N.Expression = new Node('EXPRESSION', blob, this.state.pos)
		const start = this.state.pos

		for (const [i, token] of tokens.entries()) {
			this.state.pos += this.nextToken(token, tokens[i - 1], tree)
		}

		this.state.pos = start

		return tree
	}

	nextToken(token: Token, prevToken: ?Token, tree: N.Expression) {
		if (this.state.pos >= this.blob.length) return 0

		const node = this.parseToken(token, tree)

		if (
			token.type !== tt.BIN_OPERATOR
			&& prevToken && prevToken.type !== tt.BIN_OPERATOR
		) {
			// eslint-disable-next-line no-param-reassign
			tree.body = pushItemToNode(
				this.parseBinOperator({ type: tt.BIN_OPERATOR, match: '*' }),
				tree.body,
			)
		}

		// eslint-disable-next-line no-param-reassign
		tree.body = pushItemToNode(node, tree.body)

		return token.match.length
	}

	parseToken(token: Token, tree: N.Expression) {
		switch (token.type) {
			case tt.LITERAL:
				return this.parseLiteral(token)
			case tt.BIN_OPERATOR: {
				const node = this.parseBinOperator(token)
				if (!tree.body && getNodeOrder(node) !== 1) {
					this.state.errors.push(this.createNode({
						type: tt.ERROR,
						match: `'${token.match}' can't be an unary operator`,
					}))
				} else if (tree.body && tree.body.type === tt.BIN_OPERATOR && !tree.body.right) {
					this.state.errors.push(this.createNode({
						type: tt.ERROR,
						match: `two operators can't be near each other: ${tree.body.raw} ${node.raw}`,
					}))
				}

				return node
			}
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

		return this.createNode({ type: 'NONPARSABLE', match: token.match })
	}

	createNode(token: Token): N.Node & { [string]: any } {
		return new Node(token.type, token.match, this.state.pos)
	}

	parseLiteral(token: Token): N.Literal {
		const node = this.createNode(token)
		node.value = Number(node.raw)
		return node
	}

	parseBinOperator(token: Token): N.BinOperator {
		const node = this.createNode(token)
		node.operator = node.raw
		// NOTE: because both are initialized to null this is faster
		// eslint-disable-next-line no-multi-assign
		node.left = node.right = null
		return node
	}

	parseBrackets(match: string) {
		return this.parse(toTokens(match), match)
	}

	parseAbsBrackets(token: Token): N.Function {
		const node = this.createNode({
			type: tt.FUNCTION,
			match: token.match,
		})
		node.name = 'abs'
		node.args = [this.parseBrackets(token.match.slice(1, -1))]

		return node
	}

	parseFunction(token: Token): N.Function {
		const node: N.Function = this.createNode(token)

		node.name = getMatch(token.match, /[a-z]+/)
		node.args =
			token.match.replace(node.name, '')
			.slice(1, -1)
			.split(',')
			.map(str => this.parseBrackets(str))

		const isNotValid = isNotValidFunction(node.name, node.args)

		if (isNotValid) {
			this.state.errors.push(this.createNode({
				type: tt.ERROR,
				match: isNotValid,
			}))
		}

		return node
	}

	parseNamedNode(token: Token): N.NamedNode {
		const node = this.createNode(token)
		node.name = token.match
		return node
	}

	parseParam(token: Token) {
		const node = this.parseNamedNode(token)
		this.state.params.add(node.name)
		return node
	}
}
