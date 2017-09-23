/**
 * Copyright 2017-present, Itamar Yatom.
 * All rights reserved.
 *
 * supports functionional wrapper for basic operators of arithematic expressions.
 * @flow
 */

/* operators order.
 * not all of them have functions, like `=`, but they are needed for parsing
 */
const OPERATORS_ORDER = [
	// '=',
	'+-',
	'*/%',
	'^',
	'!',
]
export const OPERATORS = OPERATORS_ORDER
	.join('')
	.split('')

export const orderPosition = (str: string) => (
	OPERATORS_ORDER.findIndex(item => item.indexOf(str) > -1) + 1
	|| OPERATORS_ORDER.length + 1
)

export const UNARY_OPERATORS = {
	prefix: '+-',
	postfix: '!',
}

export const isUnaryOperator = (str: string) => (
	UNARY_OPERATORS.prefix.includes(str)
	|| UNARY_OPERATORS.postfix.includes(str)
)
