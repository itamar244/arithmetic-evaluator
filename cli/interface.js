// @flow
/* eslint no-await-in-loop: 0 */
import readline from 'readline'

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

export const question = (query: string) => new Promise(res => rl.question(query, res))

export async function getParams(params: Iterable<string>) {
	const givenParams = {}
	for (const param of params) {
		givenParams[param] = Number(await question(`enter value for param ${param}: `))
	}
	return givenParams
}

export const close = () => rl.close()
