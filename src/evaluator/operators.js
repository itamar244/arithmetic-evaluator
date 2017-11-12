// @flow
import type { UnaryOperator, BinaryOperator } from '../types'

export function evaluateBinary(
	operator: BinaryOperator,
	left: number,
	right: number,
) {
	switch (operator) {
		case '+':
			return left + right
		case '-':
			return left - right
		case '*':
			return left * right
		case '/':
			return left / right
		case '^':
			return left ** right
		case '%':
			return left % right
		default:
			throw TypeError(`${operator} isn't supported binary operator`)
	}
}

export function evaluateUnary(operator: UnaryOperator, argument: number) {
	switch (operator) {
		case '+':
			return +argument
		case '-':
			return -argument
		case '!': {
			let result = 1
			for (let i = 1; i <= argument; i += 1) {
				result *= i
			}
			return result
		}
		default:
			throw TypeError(`${operator} isn't supported unary operator`)
	}
}
