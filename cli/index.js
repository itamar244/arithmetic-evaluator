// @flow
import {
	parse,
	evaluateExpression,
	evaluateEquation,
	PREDEFINED_IDENTIFIERS,
} from '../src'
import * as cli from './interface'
import * as logger from './logger'
import { benchmark } from '../src/utils'

logger.infoOfProgram()
logger.ifHasArgs(['-h', '--help'], () => logger.rulesOfExpression()).then((neededHelp) => {
	if (neededHelp) {
		cli.close()
	} else {
		main(process.argv)
	}
})

async function main(args) {
	const answer = await cli.question(' > ')

	if (answer) {
		try {
			const result = parse(answer)
			const { expression } = result

			logger.ifHasArgs(['--benchmark'], () =>
				benchmark(
					() => parse(answer),
					[],
					Number(args[args.indexOf('--benchmark') + 1]) || undefined,
				),
			)
			logger.ifHasArgs(['-t', '--tree'], JSON.stringify(expression, null, 4))

			if (
				expression.body
				&& expression.body.type === 'Equation'
			) {
				logger.result(
					evaluateEquation(
						expression.body,
						Object.keys(result.identifiers)[0],
					),
				)
			} else {
				logger.result(
					evaluateExpression(
						expression,
						await cli.getParams(Object.keys(result.identifiers), PREDEFINED_IDENTIFIERS),
					),
				)
			}
		} catch (e) {
			console.error(e)
		}
		main(process.argv)
	} else {
		cli.close()
	}
}
