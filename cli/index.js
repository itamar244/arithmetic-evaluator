// @flow
import { parse, evaluateExpression } from '../src'
import * as cli from './interface'
import * as logger from './logger'
import { benchmark } from '../src/utils'

logger.infoOfProgram()
logger.ifHasArgs(['-h', '--help'], () => logger.rulesOfExpression()).then((neededHelp) => {
	if (neededHelp) {
		cli.close()
	} else {
		main()
	}
})

async function main() {
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
		main()
	} else {
		cli.close()
	}
}
