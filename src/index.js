/**
 * Copyright 2017-present, Itamar Yatom.
 * All rights reserved.
 *
 * @flow
 */

import type { Statement } from './types'
import type { Scope } from './evaluator/scope'
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

export function runStatement(input: string, scope: Scope) {
	return evaluateStatement(parseStatement(input), scope)
}

export function createRepl() {
	const scope: Scope = new Map()

	return {
		evaluate: (statement: Statement) =>
			evaluateStatement(statement, scope),
		run: (input: string) =>
			runStatement(input, scope),
	}
}
