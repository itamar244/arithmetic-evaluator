/*
	written by Itamar Yatom.
	supports functionional wrapper for basic operators of arithematic expressions.
	@flow
*/


export const operators: {
	[key: string]:
		[(a: number, b?: number) => number, true]
	    | [(a: number, b: number) => number, false]
} = {
	'+': [(a, b) => typeof b === 'number' ? a + b : +a, true],
	'-': [(a, b) => typeof b === 'number' ? a - b : -a, true],
	'*': [(a, b) => a * b, false],
	'/': [(a, b) => a / b, false],
	'^': [(a, b) => a ** b, false],
}

// return is a string is one of the valid operators
export const isOperator = (str: string) => operators.hasOwnProperty(str)

const orderOfOperators = [
	['^'],
	['*', '/'],
	['+', '-']
]
export const orderPosition = (str: string) => (
	(orderOfOperators.findIndex(item => item.indexOf(str) > -1) + 1)
	|| orderOfOperators.length + 1
)
