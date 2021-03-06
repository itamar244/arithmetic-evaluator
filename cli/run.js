// @flow
import { readFileSync } from 'fs'

import {
	parse,
	parseStatement,
	evaluate,
	createRepl,
} from '../src'
import {
	createInterface,
	log,
	benchmark,
} from './utils'

function benchmarkInput<ParseFunc: Function, EvaluateFunc: Function>(
	input: string,
	parseFunc: ParseFunc,
	evaluateFunc: EvaluateFunc,
	toBenchmarkEvaluate: bool = true,
) {
	const parseTime = benchmark(
		parseFunc,
		[input],
		3000,
	)

	log(`parsing operations per second: ${parseTime}`)

	if (toBenchmarkEvaluate) {
		const evaluateTime = benchmark(
			evaluateFunc,
			[parseFunc(input)],
			3000,
		)

		log(`evaluating operations per second: ${evaluateTime}`)
	}
}

export async function runRepl(options: Object) {
	const rl = createInterface()
	const repl = createRepl()

	for (;;) {
		// eslint-disable-next-line no-await-in-loop
		const line = await rl.question('> ')

		if (line.length === 0) break

		try {
			const result = repl.run(line)

			log(result.toString())

			if (options.benchmark) {
				benchmarkInput(
					line,
					parseStatement,
					repl.evaluate,
					result.type !== 'Null',
				)
			}
		} catch (e) {
			log(e, true)
		}
	}

	rl.close()
}

export function runWithFileGiven(filename: string, options: Object) {
	const input = String(readFileSync(filename))

	try {
		const program = parse(input, { filename })

		if (options.benchmark) {
			benchmarkInput(input, parse, evaluate)
		}

		if (options.tree) {
			log(JSON.stringify(program, null, 4))
		}

		log(evaluate(program).toString())
	} catch (e) {
		log(e, true)
	}
}
