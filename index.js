// @flow
/* eslint no-console: 0, no-await-in-loop: 0 */
const parser = require('./src/parser')
const evaluator = require('./src/evaluator')
const readline = require('readline')

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

const question = query => new Promise(res => rl.question(query, res))

async function getParams(params) {
	const givenParams = {}
	for (const param of params) {
		givenParams[param] = Number(await question(`enter value for param ${param}: `))
	}
	return givenParams
}

main(process.argv)
async function main(args) {
	const answer = await question('please enter your arithematic expression: ')
	if (answer) {
		const parsedResult = parser.parse(answer)

		console.log(parsedResult.body)
		if (parsedResult.type === 'EXPRESSION') {
			do {
				console.log(evaluator.evaluate(parsedResult.body, await getParams(parsedResult.params)))
			} while (parsedResult.params.size > 0 && await question('try again? '))
		} else if (parsedResult.type === 'EQUATION') {
			console.log(evaluator.evaluateEquation(parsedResult.body, [...parsedResult.params][0]))
		} else {
			console.error(parsedResult.body)
		}
		main(args)
	} else {
		rl.close()
	}
}
