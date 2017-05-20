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
	params: Set<string>,
}

type Result$Expression = {
	type: 'EXPRESSION',
	body: Tree,
	params: Set<string>,
}

type Result$Error = {
	type: 'ERROR',
	body: string,
}

export function parse(str: string): Result$Equation | Result$Expression | Result$Error {
	try {
		const parser = new Parser(str)

		if (parser.parts.length > 2) {
			return { type: 'ERROR', body: 'string has too many equal signs' }
		}

		const results = parser.statements.map(({ tree }) => tree.toArray())

		return (
			parser.hasError
			? { type: 'ERROR', body: 'couldn\'t parse tree' }
			// is an expression
			: results.length === 1
			? { type: 'EXPRESSION', body: results[0], params: parser.params }
			// if there is more than one parameter it will return an error
			: parser.params.size !== 1
			? { type: 'ERROR', body: 'for equation 1 param is needed' }
			// is equation
			: { type: 'EQUATION', body: results, params: parser.params }
		)
	} catch (body) {
		return { type: 'ERROR', body }
	}
}
