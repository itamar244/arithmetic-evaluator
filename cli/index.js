// @flow
/* eslint no-await-in-loop: 0 */
import {
	parse,
	evaluate,
	evaluateEquation,
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

		if (parsedResult.type === 'EXPRESSION') {
			do {
				logger.result(evaluate(parsedResult.body, await cli.getParams(parsedResult.params)))
			} while (parsedResult.params.size > 0 && await cli.question('try again? '))
		} else if (parsedResult.type === 'EQUATION') {
			logger.result(evaluateEquation(parsedResult.body, [...parsedResult.params][0]))
		} else {
			logger.log(parsedResult.body, true)
		}
		main(args)
	} else {
		cli.close()
	}
}
