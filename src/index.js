/**
 * Copyright 2017-present, Itamar Yatom.
 * All rights reserved.
 *
 * Main export from from internal modules.
 *
 * @flow
 */

import Parser from './parser'
import {
	defaultOptions,
	getOptions,
	type Options,
} from './options'
import {
	evaluate,
	evaluateStatement,
} from './evaluator'

export {
	evaluate,
	Parser,
	evaluateStatement,
}

export function parse(input: string, options?: Options) {
	return new Parser(input, getOptions(options)).parse()
}

export function parseStatement(input: string) {
	return new Parser(input, defaultOptions).getStatement()
}

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
