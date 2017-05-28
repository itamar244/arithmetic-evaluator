// @flow
import { parse, evaluateExpression, evaluateEquation } from '../src'
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
			if (parsedResult.trees.length === 1) {
				logger.result(
					evaluateExpression(
						parsedResult.trees[0],
						await cli.getParams(parsedResult.state.params),
					),
				)
			} else {
				logger.result(
					evaluateEquation(
						parsedResult.trees,
						[...parsedResult.state.params][0],
					),
				)
			}
		} else {
			logger.log(parsedResult.state.errors.map(error => error.raw).join('\n'), true)
		}
		main()
	} else {
		cli.close()
	}
}
