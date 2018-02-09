// @flow
import * as n from '../nodes'
import { types as tt, type TokenType } from '../tokenizer/types'
import UtilParser from './util'

export default class ExpressionParser extends UtilParser {
	parseExpressionBody(topLevel: bool): n.Node {
		const node = this.parseMaybePostfixUnary(topLevel)
		if (this.needMultiplierShortcut(node)) {
			return this.parseBinary(node, -1, false, tt.star, '*')
		}
		if (this.state.type.binop !== null) {
			return this.parseToken(topLevel, node)
		}
		return node
	}

	parseToken(topLevel: bool, body: ?n.Node): n.Node {
		switch (this.state.type) {
			case tt.plus:
			case tt.minus:
				if (body == null) return this.parsePrefixUnary()
				// eslint-disable-next-line no-fallthrough
			case tt.star:
			case tt.slash:
			case tt.modulo:
			case tt.exponent:
				if (body == null) {
					throw this.unexpected("can't be an unary operator")
				}

				return this.parseBinary(body, -1)
			case tt.num:
				return this.parseNumeric()
			case tt.parenL:
				return this.parseParenthesized(tt.parenR)
			case tt.crotchet:
				return this.parseParenthesized(tt.crotchet)
			case tt.name:
				return this.parseMaybeCallExpression()
			default:
				throw this.unexpected()
		}
	}

	parseParenthesized(end: TokenType): n.Expression {
		this.next()
		const node = new n.Expression(
			this.parseExpressionBody(false),
			end === tt.crotchet,
		)
		this.expect(end)
		return node
	}

	parseNumeric(): n.NumericLiteral {
		const value = Number(this.state.value)
		this.next()
		return new n.NumericLiteral(value)
	}

	parseMaybePostfixUnary(topLevel: ?bool, body: ?n.Node) {
		const maybeArgument = this.parseToken(!!topLevel, body)

		if (this.state.type.postfix) {
			return new n.UnaryExpression(
				this.state.value,
				maybeArgument,
				false,
			)
		}
		return maybeArgument
	}

	parsePrefixUnary(): n.UnaryExpression {
		if (!this.state.type.prefix) this.unexpected()
		const operator = this.state.value

		this.next()
		return new n.UnaryExpression(
			operator,
			this.parseToken(false),
			true,
		)
	}

	parseBinary<Left: n.Node>(
		left: Left,
		minPrec: number,
		toMoveNext: bool = true,
		type: TokenType = this.state.type,
		operator?: n.BinaryOperator,
	): Left | n.BinaryExpression {
		const prec = type.binop

		if (prec !== null && prec > minPrec) {
			const nodeOperator = operator || this.state.value
			if (toMoveNext) this.next()
			const maybePostfixUnary = this.parseMaybePostfixUnary()
			const right =
				this.needMultiplierShortcut(maybePostfixUnary)
				? this.parseBinary(maybePostfixUnary, minPrec, false, tt.star, '*')
				: this.parseBinary(maybePostfixUnary, prec)

			return this.parseBinary(
				new n.BinaryExpression(nodeOperator, left, right),
				minPrec,
			)
		}

		return left
	}

	parseCallExpression(callee: n.Identifier): n.CallExpression {
		const args = []

		this.next()
		while (!this.eat(tt.parenR)) {
			args.push(this.parseExpressionBody(false))
			if (!this.eat(tt.comma) && !this.match(tt.parenR)) {
				this.unexpected()
			}
		}

		return new n.CallExpression(callee, args)
	}

	parseMaybeCallExpression(): n.Identifier | n.CallExpression {
		const node = this.parseIdentifier()

		if (this.match(tt.parenL) && this.state.prevSpacePadding === 0) {
			return this.parseCallExpression(node)
		}

		return node
	}

	parseIdentifier(): n.Identifier {
		const name = this.state.value
		this.next()
		return new n.Identifier(name)
	}
}
