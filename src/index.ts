/**
 * Copyright 2017-present, Itamar Yatom.
 * All rights reserved.
 */

import { Statement } from './types'
import { Scope } from './evaluator/scope'
import Parser from './parser'
import {
	defaultOptions,
	getOptions,
	Options,
} from './options'
import {
	evaluate,
	evaluateStatement,
} from './evaluator'

export {
	evaluate,
	evaluateStatement,
}

export function parse(input: string, options?: Partial<Options>) {
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
