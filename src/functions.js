// @flow
const functions = new Map([
	['cos', 1],
	['sin', 1],
	['tan', 1],
	['abs', 1],
	['log', 2],
	['floor', 1],
	['sqrt', 1],
	['max', Infinity]
])

export function isNotValidFunction(name: string, args: any[]) {
	let len = functions.get(name)
	if (!len) {
		return 'not a valid function'
	} else if (args.length !== len && len !== 0 && len !== Infinity) {
		return `${name}: needed ${len} arguments`
	}
}
