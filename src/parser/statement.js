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
		return this.finishNode(result, 'Result')
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

		return this.finishNode(tree, 'Expression')
	}

	nextToken(token: Token, tree: N.Expression) {
		// eslint-disable-next-line no-param-reassign
		tree.body = mergeNodes(this.parseToken(token, tree), tree.body)
	}

	parseToken(token: Token, tree: N.Expression) {
		const node = this.startNode(token.match)

		switch (token.type) {
			case tt.LITERAL:
				return this.parseLiteral(node)
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
				return this.parseAbsBrackets(node)
			case tt.FUNCTION:
				return this.parseFunction(node)
			case tt.CONSTANT:
				return this.parseConstant(node)
			case tt.PARAM:
				return this.parseParam(node)
			default:
				this.addError(`${token.match}: not a valid token`)
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

		if (isNotValid) this.addError(isNotValid)

		return this.finishNode(node, 'Function')
	}

	parseConstant(node: N.NamedNode): N.NamedNode {
		node.name = node.raw
		return this.finishNode(node, 'Constant')
	}

	parseParam(node: N.Parameter): N.Parameter {
		this.state.params.add(node.raw)
		node.name = node.raw
		return this.finishNode(node, 'Parameter')
	}
}
