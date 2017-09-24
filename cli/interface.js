// @flow
import readline from 'readline'

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

export const question = (query: string): Promise<string> => (
	new Promise(res => rl.question(query, res))
)

export const close = () => rl.close()
