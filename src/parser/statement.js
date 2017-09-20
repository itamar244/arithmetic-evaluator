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
	input: string
	state: State

	raise(error: string) {
		throw `${this.state.pos} - ${error}`
	}

	parseTopLevel(result: N.Result): N.Result {
		result.expression = this.parseString(this.input, true)
		result.params = [...this.state.params]
		return this.finishNode(result, 'Result')
	}

	// FIXME: fix this.state.pos, it is broken when `parse` is called recursively
	parseString(input: string, topLevel?: bool): N.Expression {
		const tokens = toTokens(input)
		const expression: N.Expression = this.startNode(input)
		const nextToken = (node) => {
			expression.body = mergeNodes(node, expression.body)
		}

		for (let i = 0; i < tokens.length; i += 1) {
			if (
				tokens[i].type !== tt.OPERATOR
				&& i > 0 && tokens[i - 1].type !== tt.OPERATOR
			) {
				nextToken(this.parseOperator(this.startNode('*'), expression))
			}
			nextToken(this.parseToken(tokens[i], expression, !!topLevel))
			this.state.lastTokenType = tokens[i].type
		}

		return this.finishNode(expression, 'Expression')
	}

	parseToken(token: Token, tree: N.Expression, topLevel: bool) {
		const match = tree.raw.slice(token.start, token.end)
		const node = this.startNode(match)

		switch (token.type) {
			case tt.LITERAL:
				return this.parseLiteral(node)
			case tt.OPERATOR: {
				this.parseOperator(node, tree)
				// if node is binary operator and there it is the first node
				if (tree.body == null) {
					if (node.type === 'BinaryOperator') {
						this.raise(`'${node.operator}' can't be an unary operator`)
					}
				} else if (this.state.lastTokenType === tt.OPERATOR) {
					this.raise(`two operators can't be near each other: ${tree.body.raw} ${node.raw}`)
				}
				if (!topLevel && node.operator === '=') {
					this.raise("'=' sign can only be at top level")
				}

				return node
			}
			case tt.BRACKETS:
				return this.parseString(match.slice(1, -1))
			case tt.ABS_BRACKETS:
				return this.parseAbsBrackets(node)
			case tt.FUNCTION:
				return this.parseFunction(node)
			case tt.CONSTANT:
				return this.parseConstant(node)
			case tt.IDENTIFIER:
				return this.parseIdentifier(node)
			default:
				this.raise(`${match}: not a valid token`)
				return this.finishNode(node, 'NonParsable')
		}
	}

	parseLiteral(node: N.Literal): N.Literal {
		node.value = Number(node.raw)
		return this.finishNode(node, 'Literal')
	}

	parseOperator(
		node: N.AnyNode,
		tree: N.Expression,
	): N.UnaryOperator | N.BinOperator {
		node.operator = node.raw
		const isPrefix = UNARY_OPERATORS.prefix.includes(node.operator)
		if (isPrefix && tree.body == null	|| UNARY_OPERATORS.postfix.includes(node.operator)) {
			node.prefix = isPrefix
			return this.finishNode(node, 'UnaryOperator')
		}

		return this.finishNode(node, 'BinaryOperator')
	}

	parseAbsBrackets(node: N.Function): N.Function {
		node.name = 'abs'
		node.args = [this.parseString(node.raw.slice(1, -1))]

		return this.finishNode(node, 'Function')
	}

	parseFunction(node: N.Function): N.Function {
		node.name = getMatch(node.raw, /[a-z]+/)
		node.args =
			node.raw.replace(node.name, '')
			.slice(1, -1)
			.split(',')
			.map(arg => this.parseString(arg))

		const isNotValid = isNotValidFunction(node.name, node.args)

		if (isNotValid) this.raise(isNotValid)

		return this.finishNode(node, 'Function')
	}

	parseConstant(node: N.NamedNode): N.NamedNode {
		node.name = node.raw
		return this.finishNode(node, 'Constant')
	}

	parseIdentifier(node: N.Identifier): N.Identifier {
		this.state.params.add(node.raw)
		node.name = node.raw
		return this.finishNode(node, 'Identifier')
	}
}
