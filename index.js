// @flow
/* eslint no-console: 0, no-await-in-loop: 0 */
const parse = require('./src/parser').default
const evaluator = require('./src/evaluator').default
const readline = require('readline')
// const { benchmark } = require('./src/utils')

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
		// console.log(await benchmark(parse, [answer], 5000))
		const parsedResult = parse(answer)

		console.log(parsedResult)
		if (parsedResult.state.errors.length === 0) {
			console.log(evaluator(parsedResult.tree, await getParams(parsedResult.state.params)))
		} else {
			console.error(parsedResult.state.errors[0])
		}
		main(args)
	} else {
		rl.close()
	}
}
