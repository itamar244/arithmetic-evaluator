// @flow
export const BIN_OPERATORS_METHODS: {
	[string]: (number, number) => number
} = {
	'+': (a, b) => (a + b),
	'-': (a, b) => (a - b),
	'*': (a, b) => a * b,
	'/': (a, b) => a / b,
	'^': (a, b) => a ** b,
	'%': (a, b) => a % b,
}

export const UNARY_OPERATORS_METHODS: {
	[string]: (number) => number
} = {
	'+': num => +num,
	'-': num => -num,
	'!': (num) => {
		let result = 1
		for (let i = 1; i <= num; i += 1) {
			result *= i
		}
		return result
	},
}
