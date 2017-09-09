/**
 * Copyright 2017-present, Itamar Yatom.
 * All rights reserved.
 *
 * Main export from from internal modules.
 * exports `parse`, `evaluateEquation` and `evaluate`
 *
 * @flow
 */

import Parser from './parser'

export { evaluateExpression, evaluateEquation } from './evaluator'

export function parse(input: string) {
	return new Parser(input).parse()
}
