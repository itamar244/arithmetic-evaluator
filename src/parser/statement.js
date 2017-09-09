// @flow
import * as N from '../types'
import * as tt from '../tokenizer/types'
import toTokens, { type Token } from '../tokenizer'
import { getMatch } from '../utils'
import isNotValidFunction from '../functions'
import { UNARY_OPERATORS } from '../operators'
import NodeUtils from './node'
import State from './state'
import mergeNodes from './util'

export default class StatementParser extends NodeUtils {
	errors: N.Node[] = []
	input: string
	state: State

	addError(error: string) {
		this.errors.push(this.createNode(tt.ERROR, error))
	}

	parseTopLevel(): N.Result {
		const result: N.Result = this.createNode('RESULT', this.input)
		result.expression = this.parseString(result.raw)
		result.params = [...this.state.params]
		return result
	}

	// FIXME: fix state.pos, it is broken when `parse` is called recursively
	parseString(input: string): N.Expression {
		const tokens = toTokens(input)
		const tree = this.createNode('EXPRESSION', input)

		for (let i = 0; i < tokens.length; i += 1) {
			if (
				tokens[i].type !== tt.OPERATOR
				&& i > 0 && tokens[i - 1].type !== tt.OPERATOR
			) {
				this.nextToken({ type: tt.OPERATOR, match: '*' }, tree)
			}

			this.nextToken(tokens[i], tree)
			this.state.prevToken = tokens[i]
		}

		return tree
	}

	nextToken(token: Token, tree: N.Expression) {
		// eslint-disable-next-line no-param-reassign
		tree.body = mergeNodes(this.parseToken(token, tree), tree.body)

		return token.match.length
	}

	parseToken(token: Token, tree: N.Expression) {
		switch (token.type) {
			case tt.LITERAL:
				return this.parseLiteral(token)
			case tt.OPERATOR: {
				const node = this.parseOperator(token, tree)
				// if node is binary operator and there it is the first node
				if (this.state.prevToken == null) {
					if (node.type === 'BIN_OPERATOR') this.addError(`'${token.match}' can't be an unary operator`)
				} else if (this.state.prevToken.type === tt.OPERATOR) {
					this.addError(`two operators can't be near each other: ${tree.body.raw} ${node.raw}`)
				}

				return node
			}
			case tt.BRACKETS:
				return this.parseString(token.match.slice(1, -1))
			case tt.ABS_BRACKETS:
				return this.parseAbsBrackets(token)
			case tt.FUNCTION:
				return this.parseFunction(token)
			case tt.CONSTANT:
				return this.parseNamedNode(token)
			case tt.PARAM:
				return this.parseParam(token)
			default:
				this.addError(`${token.match}: not a valid token`)
				return this.createNode('NONPARSABLE', token.match)
		}
	}

	parseLiteral(token: Token): N.Literal {
		const node = this.createNodeFromToken(token)
		node.value = Number(node.raw)
		return node
	}

	parseOperator(token: Token, tree: N.Expression): N.UnaryOperator | N.BinOperator {
		const operator = token.match
		const isPrefix = UNARY_OPERATORS.prefix.includes(operator)
		let node

		if (isPrefix && tree.body == null	|| UNARY_OPERATORS.postfix.includes(operator)) {
			if (tree.body == null && !isPrefix) {
				this.addError('postfixed unary operators can not be without an argument before')
			}
			node = this.createNode(tt.UNARY_OPERATOR, operator)
			node.argument = null
			node.prefix = isPrefix
		} else {
			node = this.createNode(tt.BIN_OPERATOR, operator)
			// NOTE: because both are initialized to null this is faster
			// eslint-disable-next-line no-multi-assign
			node.left = node.right = null
		}
		node.operator = operator

		return node
	}

	parseAbsBrackets(token: Token): N.Function {
		const node: N.Function = this.createNode(tt.FUNCTION, token.match)
		node.name = 'abs'
		node.args = [this.parseString(token.match.slice(1, -1))]

		return node
	}

	parseFunction(token: Token): N.Function {
		const node: N.Function = this.createNodeFromToken(token)

		node.name = getMatch(token.match, /[a-z]+/)
		node.args =
			token.match.replace(node.name, '')
			.slice(1, -1)
			.split(',')
			.map(arg => this.parseString(arg))

		const isNotValid = isNotValidFunction(node.name, node.args)

		if (isNotValid) this.addError(isNotValid)

		return node
	}

	parseNamedNode(token: Token): N.NamedNode {
		const node = this.createNodeFromToken(token)
		node.name = token.match
		return node
	}

	parseParam(token: Token) {
		const node = this.parseNamedNode(token)
		this.state.params.add(node.name)
		return node
	}
}
