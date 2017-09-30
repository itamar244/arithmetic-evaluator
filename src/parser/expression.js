// @flow
import * as N from '../types'
import { types as tt, type TokenType } from '../tokenizer/types'
import NodeUtils from './node'

export default class ExpressionParser extends NodeUtils {
	parseExpressionBody(topLevel: bool): N.Node {
		const node = this.parseMaybeUnary(topLevel)
		if (this.needMultiplierShortcut()) {
			return this.parseBinary(node, -1, false, tt.star, '*')
		}
		if (this.state.type.binop !== null) {
			return this.parseToken(topLevel, node)
		}
		return node
	}

	parseToken(topLevel: bool, body: ?N.Node): N.Node {
		const node = this.startNode()

		switch (this.state.type) {
			case tt.plus:
			case tt.minus:
				if (body == null) return this.parseUnary(node)
				// eslint-disable-next-line no-fallthrough
			case tt.eq:
			case tt.star:
			case tt.slash:
			case tt.modulo:
			case tt.exponent:
				if (this.match(tt.eq) && !topLevel) this.unexpected()
				if (body == null) {
					throw this.unexpected("can't be an unary operator")
				}

				return this.parseBinary(body, -1)
			case tt.num:
				return this.parseNumeric(node)
			case tt.parenL:
				return this.parseParenthesized(node, tt.parenR)
			case tt.crotchet:
				return this.parseParenthesized(node, tt.crotchet)
			case tt.name:
				return this.parseMaybeCallExpression(node)
			default:
				throw this.unexpected()
		}
	}

	parseParenthesized(
		node: N.Expression,
		end: TokenType,
	): N.Expression {
		this.next()
		node.body = this.parseExpressionBody(false)
		this.expect(end)
		return this.finishNode(
			node,
			end === tt.crotchet ? 'AbsParentheses' : 'Expression',
		)
	}

	parseNumeric(node: N.NumericLiteral): N.NumericLiteral {
		node.value = Number(this.state.value)
		this.next()
		return this.finishNode(node, 'NumericLiteral')
	}

	parseMaybeUnary(topLevel: ?bool, body: ?N.Node) {
		const maybeArgument = this.parseToken(!!topLevel, body)

		if (this.state.type.postfix) {
			const node: N.UnaryExpression = this.startNode()
			node.argument = maybeArgument
			return this.parseUnary(node)
		}
		return maybeArgument
	}

	parseUnary(node: N.AnyNode): N.UnaryExpression {
		node.operator = this.state.value
		node.prefix = this.state.type.prefix

		this.next()
		if (node.prefix) {
			node.argument = this.parseToken(false)
		}

		return this.finishNode(node, 'UnaryExpression')
	}

	parseBinary(
		left: N.AnyNode,
		minPrec: number,
		toMoveNext: bool = true,
		type: TokenType = this.state.type,
		operator?: N.BinaryOperator,
	): N.BinaryExpression {
		const prec = type.binop
		if (prec !== null && prec > minPrec) {
			const node: N.BinaryExpression = this.startNodeAtNode(left)
			node.left = left
			node.operator = operator || this.state.value

			if (toMoveNext) this.next()
			const right = this.parseMaybeUnary()
			node.right =
				this.needMultiplierShortcut()
				? this.parseBinary(right, minPrec, false, tt.star, '*')
				: this.parseBinary(right, prec)

			return this.parseBinary(
				this.finishNode(node, type === tt.eq ? 'Equation' : 'BinaryExpression'),
				minPrec,
			)
		}
		return left
	}

	parseCallExpression(callee: N.Identifier): N.CallExpression {
		const node: N.CallExpression = this.startNodeAtNode(callee)
		node.callee = callee
		node.args = []

		this.next()
		while (!this.eat(tt.parenR)) {
			node.args.push(this.parseExpressionBody(false))
			if (!this.eat(tt.comma) && !this.match(tt.parenR)) {
				this.unexpected()
			}
		}

		return this.finishNode(node, 'CallExpression')
	}

	parseMaybeCallExpression(node: N.Identifier): N.Identifier | N.CallExpression {
		this.parseIdentifier(node)

		if (this.match(tt.parenL) && this.state.prevSpacePadding === 0) {
			return this.parseCallExpression(node)
		}

		return node
	}

	parseIdentifier(node: N.Identifier): N.Identifier {
		node.name = this.state.value
		this.next()
		return this.finishNode(node, 'Identifier')
	}
}
