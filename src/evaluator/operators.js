// @flow
import type { UnaryOperator, BinaryOperator } from '../types'
import { fact } from './functions'

export function evaluateBinary(
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
		default: return 0
	}
}

export function evaluateUnary(operator: UnaryOperator, argument: number) {
	switch (operator) {
		case '+': return +argument
		case '-': return -argument
		case '!': return fact(argument)
		default: return 0
	}
}
