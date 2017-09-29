// @flow
import { readFileSync } from 'fs'

import {
	parse,
	evaluate,
	createRepl,
} from '../src'
import {
	createInterface,
	benchmark,
} from './utils'
import logger from './logger'

export async function runRepl() {
	const rl = createInterface()
	const repl = createRepl()
	let emptyLine = false

	while (!emptyLine) {
		// eslint-disable-next-line no-await-in-loop
		const line = await rl.question('> ')

		if (line.length > 0) {
			try {
				logger(repl(line))
			} catch (e) {
				logger(e.message)
			}
		} else {
			emptyLine = true
			rl.close()
		}
	}
}

export function runWithFileGiven(file: string, options: Object) {
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
