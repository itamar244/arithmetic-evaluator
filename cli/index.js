// @flow
import { createParser, evaluate } from '../src'
import * as cli from './interface'
import * as logger from './logger'
import { benchmark } from '../src/utils'

const parse = createParser()

logger.infoOfProgram()
logger.ifHasArgs(['-h', '--help'], () => logger.rulesOfExpression()).then((neededHelp) => {
	if (neededHelp) {
		cli.close()
	} else {
		main(process.argv)
	}
})

async function main(args) {
	const input = await cli.question(' > ')

	if (input) {
		try {
			const result = parse(input)
			logger.ifHasArgs(['--benchmark'], () =>
				benchmark(
					parse,
					[input],
					Number(args[args.indexOf('--benchmark') + 1]) || undefined,
				),
			)
			logger.ifHasArgs(['-t', '--tree'], JSON.stringify(result.expression, null, 4))

			logger.result(evaluate(result))
		} catch (e) {
			console.error(e.message)
		}
		main(process.argv)
	} else {
		cli.close()
	}
}
