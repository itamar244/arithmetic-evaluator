// @flow
/* eslint-disable no-console */

export function log(str: string, error: bool = false) {
	(error ? console.error : console.log)(str.replace(/\t*/g, ''))
}

export function infoOfProgram() {
	log(`
		welcome to arithmetic-evaluator command-line interface.
		from now on please enter arithmetic expressions and to quit enter an empty line.
	`)
}

export function rulesOfExpression() {
	log(`
		- the following operators are legal: +, -, *, /, %, ^.

		- numbers can be both integers, floating numbers and 'Infinity'.

		- the following functions are available:
		    - cos (length: 1)
		    - sin (length: 1)
		    - tan (length: 1)
		    - abs (length: 1)
		    - log (length: 1)
		    - floor (length: 1)
		    - sqrt (length: 1)
		    - max (length: as many as you want)

		- constants can be used. they need to be in capital letters only.
		  they are the same as the constants in Math object.

		- parameters can be used too. just use lower-cased chars and for each char the program will ask for its value.
	`)
}

export function result(res: *) {
	log(String(res))
}

export async function ifHasArgs(args: string[], strOrFunction: any | () => any) {
	if (args.some(arg => process.argv.indexOf(arg) > -1)) {
		result(typeof strOrFunction === 'function' ? await strOrFunction() : strOrFunction)
	}
}