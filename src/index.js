/**
 * Copyright 2017-present, Itamar Yatom.
 * All rights reserved.
 *
 * Main export from from internal modules.
 * exports `parse`, `evaluateEquation` and `evaluate`
 * also exports `PREDEFINED_IDENTIFIERS` to let the client know if an identifier is defined
 *
 * @flow
 */

import Parser from './parser'
import {
	evaluate,
	evaluateStatement,
} from './evaluator'

export { evaluate }

const parser = new Parser()

export const parse = parser.parse.bind(parser)
export const parseStatement = parser.parseSingleLine.bind(parser)

export const run = (input: string) => (
	evaluate(parse(input))
)

export function createRepl() {
	const scope = {}
	return (input: string) => evaluateStatement(
		parseStatement(input),
		scope,
	)
}
