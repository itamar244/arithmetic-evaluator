const parser = require('./dist/parser')
const evaluator = require('./dist/evaluator')
const readline = require('readline')
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

const question = (query) => new Promise((res, rej) => rl.question(query, res))

async function getParams(params) {
	const givenParams = {}
	for (const param of params) {
		givenParams[param] = Number(await question(`enter value for param ${param}: `))
	}
	return givenParams
}

main(process.argv)
async function main(args) {
	let answer = await question('please enter your arithematic expression: ')
	if (answer) {
		const parsedResult = parser.parse(answer)

		if (parsedResult.type === 'EXPRESSION') {
			console.log(parsedResult)
			try {
				do {
					console.log(evaluator.evaluator(parsedResult.value, await getParams(parsedResult.params)))
				} while (parsedResult.params.length > 0 && await question('try again? '))
			} catch (e) {
				console.error(e)
			}
		} else if (parsedResult.type === 'EQUATION') {
			console.log(
				parsedResult.params[0] + ' = ' +
				evaluator.evaluateEquation(parsedResult, parsedResult.params[0])
			)
		} else {
			console.error(parsedResult.value)
		}
		main(args)
	} else {
		rl.close()
	}
}
