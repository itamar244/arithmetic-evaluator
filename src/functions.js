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

import { pluralize } from './utils'

/* Map<string presesting the name, length: the needed length arguments>
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
	if (len == null) {
		return `'${name}' is not a valid function`
	} else if (argsLen !== len && len !== Infinity) {
		return (
			`'${name}' needed ${len} ${pluralize(len, 'argument', 'arguments')},` +
			`while ${argsLen} ${pluralize(argsLen, 'was', 'where')} given`
		)
	}

	return false
}
