// @flow
/* eslint no-await-in-loop: 0 */
import {
	parse,
	evaluateExpression,
} from '../src'
import * as logger from './logger'
import * as cli from './interface'
import { benchmark } from '../src/utils'

logger.infoOfProgram()
logger.ifHasArgs(['-h', '--help'], () => logger.rulesOfExpression())

main(process.argv)
async function main(args) {
	const answer = await cli.question(' > ')

	if (answer) {
		const parsedResult = parse(answer)

		logger.ifHasArgs(['--benchmark'], () => benchmark(parse, [answer], 5000))
		logger.ifHasArgs(['-t', '--tree'], JSON.stringify(parsedResult, null, 4))

		if (parsedResult.state.errors.length === 0) {
			logger.result(
				evaluateExpression(
					parsedResult.tree,
					await cli.getParams(parsedResult.state.params),
				),
			)
		}
		main(args)
	} else {
		cli.close()
	}
}
