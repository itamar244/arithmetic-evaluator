// @flow
export function log(str: string, error: bool = false) {
	// eslint-disable-next-line no-console
	(error ? console.error : console.log)(str.replace(/\t*/g, ''))
}

export async function result(strOrFunction: mixed | () => mixed) {
	if (typeof strOrFunction === 'function') {
		const res = await strOrFunction()
		if (res) {
			log(String(res))
		}
	} else {
		log(String(strOrFunction))
	}
}

export async function ifHasArgs(args: string[], strOrFunction: mixed | () => mixed) {
	if (args.some(arg => process.argv.indexOf(arg) > -1)) {
		await result(strOrFunction)
		return true
	}
	return false
}
