// @flow
import type {
	UnaryOperator,
	BinaryOperator,
} from '../types'
import { fact } from './runtime-values'
import {
	EvalNumber,
	type EvalValue,
} from './values'

export function binaryOperator(
	operator: BinaryOperator,
	lhs: EvalValue,
	rhs: EvalValue,
) {
	switch (operator) {
		case '+': return lhs.add(rhs)
		case '-': return lhs.substract(rhs)
		case '*': return lhs.multiply(rhs)
		case '/': return lhs.divide(rhs)
		case '^': return lhs.pow(rhs)
		case '%': return lhs.modulo(rhs)
		default:
			throw TypeError(`${operator} isn't supported as a binary operator`)
	}
}

export function unaryOperator(
	operator: UnaryOperator,
	argument: EvalValue,
) {
	switch (operator) {
		case '+': return argument
		case '-': return argument.negate()
		case '!': return fact(argument)
		default:
			throw TypeError(`${operator} isn't supported as an unary operator`)
	}
}
