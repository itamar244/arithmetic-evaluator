// @flow
/* eslint no-await-in-loop: 0 */
import readline from 'readline'

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

export const question = (query: string): Promise<string> => (
	new Promise(res => rl.question(query, res))
)

export async function getParams(params: Iterable<string>, predefined: string[]) {
	const givenParams = {}
	for (const param of params) {
		if (!predefined.includes(param)) {
			givenParams[param] = Number(await question(`enter value for param ${param}: `))
		}
	}
	return givenParams
}

export const close = () => rl.close()
