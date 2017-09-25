// @flow
import * as N from '../types'
import { types as tt, type TokenType } from '../tokenizer/types'
import NodeUtils from './node'

export default class ExpressionParser extends NodeUtils {
	parseExpression(
		node: N.Expression,
		closer: TokenType,
		topLevel?: bool,
		type?: N.NodeType,
	): N.Expression {
		node.body = this.parseExpressionBody(!!topLevel, [closer])
		return this.finishNode(node, type || 'Expression')
	}

	parseExpressionBody(topLevel: bool, breakers: TokenType[]): N.Node {
		let node = this.parseMaybeUnary(topLevel)
		this.next()
		if (!this.isLineTerminator()) {
			if (this.needMultiplierShortcut()) {
				node = this.parseBinaryOperator(node, -1, false, tt.star, '*')
			}
			if (!breakers.includes(this.state.type)) {
				this.expect(this.state.type.binop !== null)
				node = this.parseToken(topLevel, node)
			}
		}
		return node
	}

	parseToken(topLevel: bool, body: ?N.Node): N.Node {
		const node = this.startNode()

		switch (this.state.type) {
			case tt.plusMin:
				if (body == null) return this.parseUnaryOperator(node, topLevel)
				// eslint-disable-next-line no-fallthrough
			case tt.eq:
			case tt.star:
			case tt.slash:
			case tt.modulo:
			case tt.exponent:
				if (this.state.type === tt.eq) {
					if (!topLevel) this.expect(false)
					if (body == null) this.raise("expected token before '=' sign")
				}
				if (body == null) {
					throw this.raise(`'${node.operator}' can't be an unary operator`)
				}

				return this.parseBinaryOperator(body, -1)
			case tt.literal:
				return this.parseLiteral(node)
			case tt.parenL:
				this.next()
				return this.parseExpression(node, tt.parenR)
			case tt.crotchet:
				this.next()
				return this.parseExpression(node, tt.crotchet, false, 'AbsParentheses')
			case tt.name:
				return this.parseMaybeIdentifier(node)
			default:
				throw this.expect(false)
		}
	}

	parseLiteral(node: N.Literal): N.Literal {
		node.value = Number(this.state.value)
		return this.finishNode(node, 'Literal')
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

	parseUnaryOperator(node: N.AnyNode, topLevel: bool): N.UnaryOperator {
		node.operator = this.state.value
		node.prefix = this.state.type.prefix

		if (node.prefix) {
			this.next()
			node.argument = this.parseToken(topLevel)
		}

		return this.finishNode(node, 'UnaryOperator')
	}

	parseBinaryOperator(
		left: N.AnyNode,
		minPrec: number,
		toMoveNext: bool = true,
		type: TokenType = this.state.type,
		operator?: string,
	): N.BinaryOperator {
		const prec = type.binop
		if (prec !== null && prec > minPrec) {
			const node: N.BinaryOperator = this.startNode()
			node.left = left
			node.operator = operator || this.state.value

			if (toMoveNext) this.next()
			this.expect(this.state.type.binop === null)
			const right = this.parseMaybeUnary()
			this.next()
			if (this.needMultiplierShortcut()) {
				node.right = this.parseBinaryOperator(right, minPrec, false, tt.star, '*')
			} else {
				node.right = this.parseBinaryOperator(right, prec)
			}
			return this.parseBinaryOperator(
				this.finishNode(node, type === tt.eq ? 'Equation' : 'BinaryOperator'),
				minPrec,
			)
		}
		return left
	}

	parseCallExpression(callee: N.Identifier): N.CallExpression {
		const node: N.CallExpression = this.startNode()
		node.callee = callee
		node.args = []

		let inFunction = true
		while (inFunction) {
			this.next()
			node.args.push(this.parseExpressionBody(false, [tt.comma, tt.parenR]))
			if (this.state.type !== tt.comma) inFunction = false
		}

		return this.finishNode(node, 'CallExpression')
	}

	parseMaybeIdentifier(node: N.Identifier): N.Identifier | N.CallExpression {
		this.parseIdentifier(node)

		if (this.lookaheadFor(type => type === tt.parenL && this.state.prevSpacePadding === 0)) {
			return this.parseCallExpression(node)
		}

		return node
	}

	parseIdentifier(node: N.Identifier): N.Identifier {
		node.name = this.state.value

		return this.finishNode(node, 'Identifier')
	}
}
