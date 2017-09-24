/**
 * Copyright 2017-present, Itamar Yatom.
 * All rights reserved.
 *
 * Main export from from internal modules.
 * exports `parse`, `evaluateEquation` and `evaluate`
 * also exports `PREDEFINED_IDENTIFIERS` to let the client know if an identifier is defined
 *
 * `create...` functions are useful for creating a cached parser
 * this is faster for many calculations in a short time only
 * try to not keep references of the function to free memory
 * use:
 *     const parse = createParser();
 *     parse('3+3*3^3');
 *
 * @flow
 */

import Parser from './parser'
import { evaluateExpression, evaluateEquation } from './evaluator'
import type { Params, Result } from './types'

export const parse = (input: string) => (
	new Parser().parse(input)
)

export function evaluate({ expression, identifiers, params }: Result): number {
	if (expression.body != null && expression.body.type === 'Equation') {
		return evaluateEquation(expression.body, identifiers[0])
	}
	return evaluateExpression(expression.body, params)
}

export const run = (input: string) => (
	evaluate(parse(input))
)

export function createParser() {
	const parser = new Parser()
	return (input: string) => parser.parse(input)
}

export function createRunner() {
	const parser = new Parser()
	return (input: string) => evaluate(parser.parse(input))
}

export const PREDEFINED_IDENTIFIERS = Object.getOwnPropertyNames(Math)
