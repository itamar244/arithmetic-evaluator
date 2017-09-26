// @flow
import { readFileSync } from 'fs'
import { createParser, evaluate } from '../src'
import * as logger from './logger'
import { benchmark } from '../src/utils'

const parse = createParser()

logger.ifHasArgs(['-h', '--help'], () => logger.rulesOfExpression()).then((neededHelp) => {
	if (neededHelp) {
		logger.rulesOfExpression()
	} else {
		main(process.argv)
	}
})

function main(args) {
	const input = String(readFileSync(args[args.length - 1]))
	const program = parse(input)

	try {
		logger.ifHasArgs(['--benchmark'], () =>
			benchmark(
				parse,
				[input],
			),
		)

		logger.ifHasArgs(['-t', '--tree'], JSON.stringify(program, null, 4))

		logger.result(evaluate(program))
	} catch (e) {
		logger.log(e.message)
	}
}
