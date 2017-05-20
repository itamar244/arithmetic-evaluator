/*
	written by Itamar Yatom.
	supports functionional wrapper for basic operators of arithematic expressions.
	@flow
*/
import { has } from './utils'

export const operators: {
	[key: string]: (number, number) => number
} = {
	'+': (a, b) => typeof b === 'number' ? a + b : +a,
	'-': (a, b) => typeof b === 'number' ? a - b : -a,
	'*': (a, b) => a * b,
	'/': (a, b) => a / b,
	'^': (a, b) => a ** b,
	'%': (a, b) => a % b,
}

// return is a string is one of the valid operators
export const isOperator = (str: string) => has(operators, str)

const orderOfOperators = [
	['^'],
	['*', '/', '%'],
	['+', '-']
]

export const orderPosition = (str: string) => (
	orderOfOperators.findIndex(item => item.indexOf(str) > -1) + 1
	|| orderOfOperators.length + 1
)
