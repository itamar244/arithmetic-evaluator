import * as readline from 'readline'

export function createInterface() {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	})

	return {
		question: (query: string): Promise<string> => (
			new Promise(res => rl.question(query, res))
		),
		close: () => rl.close(),
	}
}

export function log(output: any, error: boolean = false) {
	// eslint-disable-next-line no-console
	(error ? console.error : console.log)(output)
}

export function benchmark<Func extends Function, Args extends any[]>(
	func: Func,
	args: Args,
	time: number = 1000,
) {
	const bindFunc = func.bind(null, ...args)
	let times = 0
	let timeSum = 0

	while (timeSum < time) {
		const start = Date.now()
		bindFunc()

		timeSum += Date.now() - start
		times += 1
	}

	return Math.floor(times / (time / 1000))
}
