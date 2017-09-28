// @flow
import * as N from '../src/types'
import type { SourceLocation } from '../src/utils/location'
import { has } from '../src/utils'

type ArrayLocation = [number, number]

export const arrToLoc = (loc: ArrayLocation) => ({
	start: loc[0],
	end: loc[1],

	loc: (({
		start: {
			line: 0,
			column: loc[0],
		},
		end: {
			line: 0,
			column: loc[1],
		},
	}: any): SourceLocation)
})

export const varDecls = (
	loc: ArrayLocation,
	decls: Array<[string, N.Node]>,
	expression: N.Node,
): N.VariableDeclerations => ({
	...arrToLoc(loc),
	declarations: decls.map(decl => varDecl(...decl)),
	expression: expr(expression),
	type: 'VariableDeclerations',
})

export const varDecl = (name: string, init: N.Node): N.VariableDeclerator => {
	const id = item('Identifier',
		[init.start - 1 - name.length, init.start - 1],
		'name',
		name,
	)

	return {
		...arrToLoc([init.start - 1 - name.length, init.end]),
		id,
		init,
		type: 'VariableDeclerator',
	}
}

export const eq = (
	loc: ArrayLocation,
	left: N.Node,
	right: N.Node,
): N.Equation => ({
	...arrToLoc(loc),
	left,
	right,
	operator: '=',
	type: 'Equation',
})

export const binary = (
	operator: N.BinaryOperator,
	loc: ArrayLocation,
	left: N.Node,
	right: N.Node,
): N.BinaryExpression => ({
	...arrToLoc(loc),
	operator,
	left,
	right,
	type: 'BinaryExpression',
})

export const unary = (
	operator: string,
	loc: ArrayLocation,
	prefix: bool,
	argument: N.Node,
) => ({
	...arrToLoc(loc),
	operator,
	prefix,
	argument,
	type: 'UnaryExpression',
})

export const item = (
	type: string,
	loc: ArrayLocation,
	key: string,
	value: mixed,
): N.AnyNode => ({
	...arrToLoc(loc),
	type,
	[key]: value,
})

export const expr = (body: N.AnyNode): N.Expression => ({
	body,
	start: body.start,
	end: body.end,
	loc: body.loc,
	type: 'Expression',
})

export const num = (loc: ArrayLocation, value: number): N.Identifier => (
	item('Literal', loc, 'value', value)
)

export const identifer = (loc: ArrayLocation, name: string): N.Identifier => (
	item('Identifier', loc, 'name', name)
)

export const func = (
	name: string,
	calleLoc: ArrayLocation,
	loc: ArrayLocation,
	...args: N.Node[]
) => ({
	...arrToLoc(loc),
	args,
	callee: item('Identifier', calleLoc, 'name', name),
	type: 'CallExpression',
})

export const nodeToJson = (obj: mixed) => {
	if (!(obj instanceof Object)) return obj
	const next = {}

	for (const key in obj) {
		if (has(obj, key)) {
			if (obj[key] instanceof Object) {
				if (Array.isArray(obj[key])) {
					next[key] = obj[key].map(nodeToJson)
				} else {
					next[key] = nodeToJson(obj[key])
				}
			} else {
				next[key] = obj[key]
			}
		}
	}

	return next
}
