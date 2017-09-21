// @flow
import * as N from '../types'
import * as tt from '../tokenizer/types'
import Tokenizer from '../tokenizer'
import isNotValidFunction from '../functions'
import { UNARY_OPERATORS } from '../operators'
import NodeUtils from './node'
import State from './state'

export default class ExpressionParser extends NodeUtils {
	// forward declarations ./statement
	+parseExpressionBody: (topLevel?: bool, breakers: tt.TokenType[]) => ?N.Node

	state: State
	tokenizer: Tokenizer

	createExpression(body: ?N.Node): N.Expression {
		const expression = this.startNode()
		expression.body = body
		return this.finishNode(expression, 'Expression')
	}

	parseToken(topLevel: bool): N.Node {
		const { prevNode } = this.state
		const node = this.startNode()

		switch (this.state.type) {
			case tt.LITERAL:
				return this.parseLiteral(node)
			case tt.OPERATOR: {
				this.parseOperator(node, prevNode)
				// if node is binary operator and there it is the first node
				if (prevNode == null) {
					if (node.type === 'BinaryOperator') {
						this.raise(`'${node.operator}' can't be an unary operator`)
					}
				} else if (
					prevNode.type === 'BinaryOperator'
					|| prevNode.type === 'UnaryOperator' && prevNode.prefix
				) {
					this.raise(`two operators can't be near each other: ${prevNode.operator} ${node.operator}`)
				}
				if (!topLevel && node.operator === '=') {
					this.raise("'=' sign can only be at top level")
				}

				return node
			}
			case tt.PAREN_L:
				return this.parseMaybeFunction(node, prevNode)
			case tt.CROTCHET:
				return this.parseAbsBrackets(node)
			case tt.IDENTIFIER:
				return this.parseIdentifier(node)
			default:
				throw this.raise(`${this.state.value}: not a valid token`)
		}
	}

	parseLiteral(node: N.Literal): N.Literal {
		node.value = Number(this.state.value)
		return this.finishNode(node, 'Literal')
	}

	parseOperator(
		node: N.AnyNode,
		prevNode: ?N.Node,
		operator?: string,
	): N.UnaryOperator | N.BinOperator {
		node.operator = operator || this.state.value
		const isPrefix = UNARY_OPERATORS.prefix.includes(node.operator)
		if (isPrefix && prevNode == null || UNARY_OPERATORS.postfix.includes(node.operator)) {
			node.prefix = isPrefix
			return this.finishNode(node, 'UnaryOperator')
		}

		return this.finishNode(node, 'BinaryOperator')
	}

	parseBrackets(node: N.Expression): N.Expression {
		node.body = this.parseExpressionBody(false, [tt.PAREN_R])
		if (this.state.type === tt.EOF) {
			this.raise("'(': no matching closing parentheses", node.loc.start)
		}
		return this.finishNode(node, 'Expression')
	}

	parseAbsBrackets(node: N.AbsParentheses): N.AbsParentheses {
		node.body = this.parseExpressionBody(false, [tt.CROTCHET])
		return this.finishNode(node, 'AbsParentheses')
	}

	parseMaybeFunction(node: N.AnyNode, prevNode: ?N.Node) {
		if (prevNode != null && prevNode.type === 'Identifier') {
			return this.parseFunction(node, prevNode.name)
		}

		return this.parseBrackets(node)
	}

	parseFunction(node: N.Function, calleeName: string): N.Function {
		node.args = []

		let inFunction = true
		while (inFunction) {
			node.args.push(this.parseExpressionBody(false, [tt.COMMA, tt.PAREN_R]))
			if (this.state.type === tt.PAREN_R) inFunction = false
		}

		this.raiseIfTruthy(isNotValidFunction(calleeName, node.args))

		return this.finishNode(node, 'Function')
	}

	parseIdentifier(node: N.Identifier): N.Identifier {
		node.name = this.state.value
		this.state.identifiers.add(node.name)
		return this.finishNode(node, 'Identifier')
	}
}
