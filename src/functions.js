/**
 * Copyright 2017-present, Itamar Yatom.
 * All rights reserved.
 *
 * checks functions for the parser.
 *
 * the main function checks if there is such function
 * and if there are correct amount of arguments
 *
 * @flow
 */

import { pluralize } from './utils'

/* Map<name, arguments length>
 * Infinity means any length of arguments */
export const functions = new Map([
	['cos', 1],
	['sin', 1],
	['tan', 1],
	['abs', 1],
	['log', 2],
	['floor', 1],
	['sqrt', 1],
	['max', Infinity],
])

export default function isNotValidFunction(name: string, { length: argsLen }: any[]) {
	const len = functions.get(name)
	if (!len) {
		return 'not a valid function'
	} else if (argsLen !== len && len !== 0 && len !== Infinity) {
		return `${name}: needed ${len} arguments, while ${argsLen} ${pluralize(argsLen, 'was', 'where')} given`
	}

	return false
}
