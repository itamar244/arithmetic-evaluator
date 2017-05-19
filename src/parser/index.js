// @flow
import Parser from './parser'

import type {
	TreeItemType,
	TreeItem,
	Tree,
} from './types'
export type { TreeItemType, TreeItem, Tree }

type Result$Equation = {
	type: 'EQUATION',
	body: Tree[],
	params: string[],
}

type Result$Expression = {
	type: 'EXPRESSION',
	body: Tree,
	params: string[],
}

type Result$Error = {
	type: 'ERROR',
	body: string,
}

export function parse(str: string): Result$Equation | Result$Expression | Result$Error {
	let parts = str.split('=');

	if (parts.length > 2) {
		return { type: 'ERROR', body: 'string has too many equal signs' }
	}

	try {
		const expressions = parts.map(part => new Parser(part).parse())
		const hasError = expressions.some(expr => expr.hasError)
		const results = expressions.map(expr => expr.toArray())
		const params = new Set()

		expressions.forEach(expr => expr.params.forEach(params.add.bind(params)))

		return (
			hasError
			? { type: 'ERROR', body: 'couldn\'t parse tree' }
			// is an expression
			: results.length === 1
			? { type: 'EXPRESSION', body: results[0], params: [...params] }
			// if there is more than one parameter it will return an error
			: params.size !== 1
			? { type: 'ERROR', body: 'for equation 1 param is needed' }
			// is equation
			: { type: 'EQUATION', body: results, params: [...params] }
		)
	} catch (body) {
		return { type: 'ERROR', body }
	}
}
