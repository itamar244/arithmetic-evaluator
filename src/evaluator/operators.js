// @flow
import type { UnaryOperator, BinaryOperator } from '../types'
import { fact } from './functions'

export function binaryOperator(
	operator: BinaryOperator,
	left: number,
	right: number,
) {
	switch (operator) {
		case '+': return left + right
		case '-': return left - right
		case '*': return left * right
		case '/': return left / right
		case '^': return left ** right
		case '%': return left % right
		default:
			throw TypeError(`${operator} isn't supported as a binary operator`)
	}
}

export function unaryOperator(
	operator: UnaryOperator,
	argument: number,
) {
	switch (operator) {
		case '+': return +argument
		case '-': return -argument
		case '!': return fact(argument)
		default:
			throw TypeError(`${operator} isn't supported as an unary operator`)
	}
}
