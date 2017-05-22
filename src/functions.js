/**
 * Copyright 2017-present, Itamar Yatom.
 * All rights reserved.
 *
 * handles the checks around the functions for the parser.
 *
 * the main function checks if there is such a function 
 * and if there are execatly enough arguments to the fitting function
 *
 * @flow
 */

/* Map<string presesting the name, length: the needed length arguments>
 * Infinity means any length of arguments */
const functions = new Map([
	['cos', 1],
	['sin', 1],
	['tan', 1],
	['abs', 1],
	['log', 2],
	['floor', 1],
	['sqrt', 1],
	['max', Infinity],
])

export default function isNotValidFunction(name: string, args: any[]) {
	const len = functions.get(name)
	if (!len) {
		return 'not a valid function'
	} else if (args.length !== len && len !== 0 && len !== Infinity) {
		return `${name}: needed ${len} arguments`
	}

	return false
}
