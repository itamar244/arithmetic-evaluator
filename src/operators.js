/*
	written by Itamar Yatom.
	supports functionional wrapper for basic operators of arithematic expressions.
	@flow
*/
import { has } from './utils'

export const operators: {
	[key: string]: (number, number) => number
} = {
	'+': (a, b) => (typeof b === 'number' ? a + b : +a),
	'-': (a, b) => (typeof b === 'number' ? a - b : -a),
	'*': (a, b) => a * b,
	'/': (a, b) => a / b,
	'^': (a, b) => a ** b,
	'%': (a, b) => a % b,
}

export const isOperator = (str: string) => has(operators, str)

const ORDER = [
	['+', '-'],
	['*', '/', '%'],
	['^'],
]

export const orderPosition = (str: string) => (
	ORDER.findIndex(item => item.indexOf(str) > -1) + 1
	|| ORDER.length + 1
)
