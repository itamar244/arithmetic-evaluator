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
	errors: string[] = []
	input: string
	state: State

	addError(error: string) {
		this.errors.push(error)
	}

	parseTopLevel(result: N.Result): N.Result {
		result.expression = this.parseString(this.input)
		result.params = [...this.state.params]
		return this.finishNode(result, 'RESULT')
	}

	// FIXME: fix this.state.pos, it is broken when `parse` is called recursively
	parseString(input: string): N.Expression {
		const tokens = toTokens(input)
		const tree = this.startNode(input)

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

		return this.finishNode(tree, 'EXPRESSION')
	}

	nextToken(token: Token, tree: N.Expression) {
		// eslint-disable-next-line no-param-reassign
		tree.body = mergeNodes(this.parseToken(token, tree), tree.body)

		return token.match.length
	}

	parseToken(token: Token, tree: N.Expression) {
		const node = this.startNode(token.match)

		switch (token.type) {
			case tt.LITERAL:
				return this.parseLiteral(node, token)
			case tt.OPERATOR: {
				this.parseOperator(node, tree)
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
				return this.parseAbsBrackets(node, token)
			case tt.FUNCTION:
				return this.parseFunction(node, token)
			case tt.CONSTANT:
				return this.parseNamedNode(node, token)
			case tt.PARAM:
				return this.parseParam(node, token)
			default:
				this.addError(`${token.match}: not a valid token`)
				return this.finishNode(node, 'NONPARSABLE')
		}
	}

	parseLiteral(node: N.Literal, token: Token): N.Literal {
		node.value = Number(token.match)
		return this.finishNode(node, token.type)
	}

	parseOperator(
		node: N.AnyNode,
		tree: N.Expression,
	): N.UnaryOperator | N.BinOperator {
		node.operator = node.raw
		const isPrefix = UNARY_OPERATORS.prefix.includes(node.operator)
		if (isPrefix && tree.body == null	|| UNARY_OPERATORS.postfix.includes(node.operator)) {
			node.prefix = isPrefix
			return this.finishNode(node, tt.UNARY_OPERATOR)
		}

		return this.finishNode(node, tt.BIN_OPERATOR)
	}

	parseAbsBrackets(node: N.Function, token: Token): N.Function {
		node.name = 'abs'
		node.args = [this.parseString(token.match.slice(1, -1))]

		return this.finishNode(node, tt.FUNCTION)
	}

	parseFunction(node: N.Function, token: Token): N.Function {
		node.name = getMatch(token.match, /[a-z]+/)
		node.args =
			token.match.replace(node.name, '')
			.slice(1, -1)
			.split(',')
			.map(arg => this.parseString(arg))

		const isNotValid = isNotValidFunction(node.name, node.args)

		if (isNotValid) this.addError(isNotValid)

		return this.finishNode(node, token.type)
	}

	parseNamedNode(node: N.NamedNode, token: Token): N.NamedNode {
		node.name = token.match
		return this.finishNode(node, token.type)
	}

	parseParam(node: N.NamedNode, token: Token) {
		this.state.params.add(token.match)
		return this.parseNamedNode(node, token)
	}
}
