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
import {
	evaluate,
	evaluateStatement,
} from './evaluator'

export { evaluate }

export const parse = (input: string) => (
	new Parser().parse(input)
)

export const parseStatement = (input: string) => (
	new Parser().parseSingleLine(input)
)

export const run = (input: string) => (
	evaluate(parse(input))
)

export function createParser() {
	const parser = new Parser()
	return parser.parse.bind(parser)
}

export function createRunner() {
	const parse = createParser()
	return (input: string) => evaluate(parse(input))
}

export function createRepl() {
	const scope = {}
	return (input: string) => evaluateStatement(
		parseStatement(input),
		scope,
	)
}
