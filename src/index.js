/**
 * Copyright 2017-present, Itamar Yatom.
 * All rights reserved.
 *
 * Main export from from internal modules.
 * exports `parse`, `evaluateEquation` and `evaluate`
 * also exports `PREDEFINED_IDENTIFIERS` to let the client know if an identifier is defined
 *
 * @flow
 */

import Parser from './parser'

export { evaluateExpression, evaluateEquation } from './evaluator'

export function parse(input: string) {
	return new Parser(input).parse()
}

export const PREDEFINED_IDENTIFIERS = Object.getOwnPropertyNames(Math)
