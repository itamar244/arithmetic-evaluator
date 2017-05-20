// @flow
import * as parser from './parser'
import { evaluate, evaluateEquation } from './evaluator'
import readline from 'readline'

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

async function benchmark<T: *[]>(func: (...T) => mixed, args: T = [], time = 1000) {
	let times = 0
	let timeSum = 0
	let start, ret, end

	while (timeSum < time) {
		/* using array destruction because this is much
		* faster than assigning values. and speed is
		* what matter because it is a benchmark */
		[start, ret, end] = [
			Date.now(),
			(await func(...args)),
			Date.now(),
		]

		timeSum += end - start
		times += 1
	}

	return Math.floor(times / (time / 1000))
}

const question = query => new Promise((res, rej) => rl.question(query, res))

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
		// console.log(await benchmark(parser.parse, [answer], 2000))
		const parsedResult = parser.parse(answer)

		console.log(parsedResult.body)
		if (parsedResult.type === 'EXPRESSION') {
			do {
				console.log(evaluate(parsedResult.body, await getParams(parsedResult.params)))
			} while (parsedResult.params.size > 0 && await question('try again? '))
		} else if (parsedResult.type === 'EQUATION') {
			console.log(evaluateEquation(parsedResult.body, [...parsedResult.params][0]))
		} else {
			console.error(parsedResult.body)
		}
		main(args)
	} else {
		rl.close()
	}
}
