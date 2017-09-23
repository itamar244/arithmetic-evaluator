// @flow
import * as N from '../types'
import { types as tt, type TokenType } from '../tokenizer/types'
import isNotValidFunction from '../functions'
import { UNARY_OPERATORS } from '../operators'
import NodeUtils from './node'

export default class ExpressionParser extends NodeUtils {
	// forward declarations ./statement
	+parseExpressionBody: (topLevel?: bool, breakers?: TokenType[]) => ?N.Node

	parseToken(topLevel: bool, body: ?N.Node): N.Node {
		const { prevNode } = this.state
		const node = this.startNode()
		this.state.prevNode = node

		switch (this.state.type) {
			case tt.operator:
				this.parseOperator(node, body, topLevel)
				// if node is binary operator the first node
				if (body == null && node.type === 'BinaryOperator') {
					this.raise(`'${node.operator}' can't be an unary operator`)
				} else if (
					prevNode
					&& (prevNode.type === 'BinaryOperator'
					|| prevNode.type === 'UnaryOperator' && prevNode.prefix)
				) {
					this.raise(`two operators can't be near each other: ${prevNode.operator} ${node.operator}`)
				}

				return node
			case tt.eq:
				if (!topLevel) this.raise("'=' sign can only be at top level")
				if (!body) throw this.raise("expected token before after '=' sign")

				return this.parseEquation(node, body)
			case tt.literal:
				return this.parseLiteral(node)
			case tt.parenL:
				return this.parseBrackets(node, tt.parenR, '(')
			case tt.crotchet:
				return this.parseBrackets(node, tt.crotchet, '|', 'AbsParentheses')
			case tt.identifier:
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
		body: ?N.Node,
		topLevel: bool,
		operator: string = this.state.value,
	): N.UnaryOperator | N.BinOperator {
		node.operator = operator
		const isPrefix = UNARY_OPERATORS.prefix.includes(node.operator)
		const isUnary =
			isPrefix && body == null
			|| UNARY_OPERATORS.postfix.includes(node.operator)
		if (!isUnary) {
			return this.parseBinaryOperator(node, topLevel, true)
		}

		node.prefix = isPrefix
		if (isPrefix) {
			this.next()
			node.argument = this.parseToken(topLevel)
		}

		return this.finishNode(node, 'UnaryOperator')
	}

	parseBinaryOperator(node: N.BinOperator, topLevel: bool, toMoveNext: bool) {
		if (toMoveNext) this.next()
		node.right = this.parseToken(topLevel)

		return this.finishNode(node, 'BinaryOperator')
	}

	parseEquation(node: N.Equation, body: N.Node): N.Equation {
		const right = this.parseExpressionBody(false)
		node.left = body
		if (!right) {
			this.raise("expected expression after '=' sign")
		} else {
			node.right = right
		}
		return this.finishNode(node, 'Equation')
	}

	parseBrackets(
		node: N.Expression,
		closer: TokenType,
		noCloseMatch: string,
		type: N.NodeType = 'Expression',
	): N.Expression {
		node.body = this.parseExpressionBody(false, [closer])
		if (this.state.type === tt.eof) {
			this.raise(`'${noCloseMatch}': no matching closing parentheses`, node.loc.start)
		}
		return this.finishNode(node, type)
	}

	parseFunction(node: N.Function, callee: N.Identifier): N.Function {
		node.callee = callee
		node.args = []

		let inFunction = true
		while (inFunction) {
			node.args.push(this.parseExpressionBody(false, [tt.comma, tt.parenR]))
			if (this.state.type === tt.parenR) inFunction = false
		}

		this.raiseIfTruthy(isNotValidFunction(callee.name, node.args))

		return this.finishNode(node, 'Function')
	}

	parseIdentifier(node: N.Identifier): N.Identifier | N.Function {
		node.name = this.state.value
		this.finishNode(node, 'Identifier')

		if (this.lookaheadFor(tt.parenL)) {
			return this.parseFunction(this.startNode(), node)
		}

		this.state.identifiers.add(node.name)
		return node
	}
}
