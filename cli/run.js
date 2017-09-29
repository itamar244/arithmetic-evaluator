// @flow
import { readFileSync } from 'fs'

import {
	createParser,
	parseStatement,
	evaluate,
	createEvaluateStatement,
} from '../src'
import {
	createRepl,
	benchmark,
} from './utils'
import logger from './logger'

export async function runRepl() {
	const repl = createRepl()
	const evaluateStatement = createEvaluateStatement()
	let emptyLine = false

	while (!emptyLine) {
		// eslint-disable-next-line no-await-in-loop
		const line = await repl.question('> ')

		if (line.length > 0) {
			try {
				const expression = parseStatement(line)

				logger(evaluateStatement(expression))
			} catch (e) {
				logger(e.message)
			}
		} else {
			emptyLine = true
			repl.close()
		}
	}
}

export function runWithFileGiven(file: string, options: Object) {
	const parse = createParser()
	const input = String(readFileSync(file))

	try {
		const program = parse(input)

		if (options.benchmark) {
			const parseTime = benchmark(
				parse,
				[input],
				3000,
			)

			logger(`parsing operations per second: ${parseTime}`)

			const evaluateTime = benchmark(
				evaluate,
				[program],
				3000,
			)

			logger(`evaluating operations per second: ${evaluateTime}`)
		}

		if (options.tree) {
			logger(JSON.stringify(program, null, 4))
		}

		logger(evaluate(program))
	} catch (e) {
		logger(e.message)
	}
}
