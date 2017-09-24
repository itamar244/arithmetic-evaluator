// @flow
import * as N from '../types'
import { types as tt, type TokenType } from '../tokenizer/types'
import isNotValidFunction from '../functions'
import NodeUtils from './node'
import { needMultiplierShortcut } from './util'

export default class ExpressionParser extends NodeUtils {
	parseExpression(topLevel: bool, breakers: TokenType[]): N.Node {
		this.next()
		let node = this.parseMaybeUnary(topLevel)
		this.next()
		if (needMultiplierShortcut(this.state, node)) {
			node = this.parseBinaryOperator(node, -1, false, tt.star, '*')
		}
		if (!breakers.includes(this.state.type)) {
			this.expected(this.state.type.binop !== null || this.state.type === tt.eq)
			node = this.parseToken(topLevel, node)
		}
		return node
	}

	parseToken(topLevel: bool, body: ?N.Node): N.Node {
		const { prevNode } = this.state
		const node = this.startNode()
		this.state.prevNode = node

		switch (this.state.type) {
			case tt.plusMin:
				if (body == null) {
					return this.parseUnaryOperator(node, topLevel)
				}
				// eslint-disable-next-line no-fallthrough
			case tt.star:
			case tt.slash:
			case tt.modulo:
			case tt.exponent:
				if (body == null) {
					throw this.raise(`'${node.operator}' can't be an unary operator`)
				} else if (
					prevNode
					&& (prevNode.type === 'BinaryOperator'
					|| prevNode.type === 'UnaryOperator' && prevNode.prefix)
				) {
					this.raise(`two operators can't be near each other: ${prevNode.operator} ${node.operator}`)
				}

				return this.parseBinaryOperator(body, -1)
			case tt.eq:
				if (!topLevel) this.expected(false)
				if (body == null) this.raise("expected token before '=' sign")

				// $FlowIgnore - can't figure out that body isn't null because this.raise throws
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
				throw this.expected(false)
		}
	}

	parseLiteral(node: N.Literal): N.Literal {
		node.value = Number(this.state.value)
		return this.finishNode(node, 'Literal')
	}

	parseUnaryOperator(node: N.AnyNode, topLevel: bool): N.UnaryOperator {
		node.operator = this.state.value
		node.prefix = this.state.type.prefix

		if (node.prefix) {
			this.next()
			node.argument = this.parseToken(topLevel)
		}

		return this.finishNode(node, 'UnaryOperator')
	}

	parseMaybeUnary(topLevel: ?bool, body: ?N.Node) {
		const maybeArgument = this.parseToken(!!topLevel, body)
		if (this.lookaheadFor(type => type.postfix)) {
			const node: N.UnaryOperator = this.startNode()
			node.argument = maybeArgument
			return this.parseUnaryOperator(node, false)
		}
		return maybeArgument
	}

	parseBinaryOperator(
		left: N.AnyNode,
		minPrec: number,
		toMoveNext: bool = true,
		type?: TokenType,
		operator?: string,
	): N.BinOperator {
		const prec = (type || this.state.type).binop
		if (prec !== null && prec > minPrec) {
			const node: N.BinOperator = this.startNode()
			node.left = left
			node.operator = operator || this.state.value

			if (toMoveNext) this.next()
			const right = this.parseMaybeUnary()
			this.next()
			if (needMultiplierShortcut(this.state, left)) {
				node.right = this.parseBinaryOperator(right, minPrec, false, tt.star, '*')
			} else {
				node.right = this.parseBinaryOperator(right, prec)
			}
			return this.parseBinaryOperator(
				this.finishNode(node, 'BinaryOperator'),
				minPrec,
			)
		}
		return left
	}

	parseEquation(node: N.Equation, body: N.Node): N.Equation {
		const right = this.parseExpression(false, [tt.eof])
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
		type?: N.NodeType,
	): N.Expression {
		node.body = this.parseExpression(false, [closer])
		if (this.state.type === tt.eof) {
			this.raise(`'${noCloseMatch}': no matching closing parentheses`, node.loc.start)
		}
		return this.finishNode(node, type || 'Expression')
	}

	parseFunction(node: N.Function, callee: N.Identifier): N.Function {
		node.callee = callee
		node.args = []

		let inFunction = true
		while (inFunction) {
			node.args.push(this.parseExpression(false, [tt.comma, tt.parenR]))
			if (this.state.type !== tt.comma) inFunction = false
		}

		this.raiseIfTruthy(isNotValidFunction(callee.name, node.args))

		return this.finishNode(node, 'Function')
	}

	parseIdentifier(node: N.Identifier): N.Identifier | N.Function {
		node.name = this.state.value
		this.finishNode(node, 'Identifier')

		if (this.lookaheadFor(type => type === tt.parenL && this.state.prevSpacePadding === 0)) {
			return this.parseFunction(this.startNode(), node)
		}

		if (!this.state.identifiers[node.name]) {
			this.state.identifiers[node.name] = true
		}
		return node
	}
}
