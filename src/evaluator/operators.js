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
	switch (argument.type) {
		case 'Number':
			switch (operator) {
				case '+': return argument
				case '-': return new EvalNumber(-argument.value)
				case '!': return fact(argument)
				default:
					throw TypeError(`${operator} isn't supported as an unary operator for number`)
			}
		case 'Vector':
			switch (operator) {
				case '+': return argument
				case '-': return argument.negate()
				default:
					throw TypeError(`${operator} isn't supported as an unary operator for vector`)
			}
		default:
			throw TypeError(`${argument.type} isn't support EvalValue type`)
	}
}
