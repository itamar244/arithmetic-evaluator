// @flow
import { readFileSync } from 'fs'

import {
	createParser,
	evaluate,
	createEvaluateStatement,
} from '../src'
import {
	createRepl,
	benchmark,
} from './utils'
import * as logger from './logger'

const parse = createParser()

export async function runRepl() {
	const repl = createRepl()
	const evaluateStatement = createEvaluateStatement()
	let emptyLine = false

	while (!emptyLine) {
		// eslint-disable-next-line no-await-in-loop
		const line = await repl.question('> ')

		if (line.length > 0) {
			try {
				const expression = parse(line)

				logger.result(evaluateStatement(expression.body[0]))
			} catch (e) {
				logger.result(e.message)
			}
		} else {
			emptyLine = true
			repl.close()
		}
	}
}

export function runWithFileGiven(file: string, options: { [string]: boolean }) {
	const input = String(readFileSync(file))

	try {
		const program = parse(input)

		if (options.benchmark) {
			const parseTime = benchmark(
				parse,
				[input],
				3000,
			)
			const evaluateTime = benchmark(
				evaluate,
				[program],
				3000,
			)

			logger.result(`parsing operations per second: ${parseTime}`)
			logger.result(`evaluating operations per second: ${evaluateTime}`)
		}

		if (options.tree) {
			logger.result(JSON.stringify(program, null, 4))
		}

		logger.result(evaluate(program))
	} catch (e) {
		logger.log(e.message)
	}
}
