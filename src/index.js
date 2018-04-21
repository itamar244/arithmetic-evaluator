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
	type Scope,
} from './evaluator'

export {
	evaluate,
	evaluateStatement,
}

export function parse(input: string, options?: $Shape<Options>) {
	return new Parser(input, getOptions(options)).parse()
}

export function parseStatement(input: string) {
	return new Parser(input, defaultOptions).getStatement()
}

export function run(input: string) {
	return evaluate(parse(input))
}

export function createRepl() {
	const scope: Scope = new Map()

	return (input: string) => evaluateStatement(
		parseStatement(input),
		scope,
	)
}
