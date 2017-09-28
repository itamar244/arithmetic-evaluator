// @flow
import * as N from '../src/types'
import { has } from '../src/utils'

type ArrayLocation = [number, number]

const arrToLoc = (loc: ArrayLocation) => ({
	start: loc[0],
	end: loc[1],
})

export const varDecls = (
	loc: ArrayLocation,
	decls: Array<[string, N.Node]>,
	expression: N.Node,
): N.VariableDeclerations => ({
	loc: arrToLoc(loc),
	declarations: decls.map(decl => ({
		id: item('Identifier',
			[decl[1].loc.start - 1 - decl[0].length, decl[1].loc.start - 1],
			'name',
			decl[0],
		),
		loc: arrToLoc([decl[1].loc.start - 1 - decl[0].length, decl[1].loc.end]),
		init: decl[1],
		type: 'VariableDeclerator',
	})),
	expression: expr(expression),
	type: 'VariableDeclerations',
})

export const eq = (
	loc: ArrayLocation,
	left: N.Node,
	right: N.Node,
): N.Equation => ({
	operator: '=',
	left,
	right,
	loc: arrToLoc(loc),
	type: 'Equation',
})

export const binary = (
	operator: N.BinaryOperator,
	loc: ArrayLocation,
	left: N.Node,
	right: N.Node,
): N.BinaryExpression => ({
	operator,
	left,
	right,
	loc: arrToLoc(loc),
	type: 'BinaryExpression',
})

export const unary = (
	operator: string,
	loc: ArrayLocation,
	prefix: bool,
	argument: N.Node,
) => ({
	operator,
	prefix,
	argument,
	loc: arrToLoc(loc),
	type: 'UnaryExpression',
})

export const item = (
	type: string,
	loc: ArrayLocation,
	key: string,
	value: mixed,
): N.AnyNode => ({
	type,
	loc: arrToLoc(loc),
	[key]: value,
})

export const expr = (body: N.AnyNode): N.Expression => (
	item('Expression', body.loc, 'body', body)
)

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
	args,
	loc: arrToLoc(loc),
	callee: item('Identifier', calleLoc, 'name', name),
	type: 'CallExpression',
})

export const toJson = (obj: mixed) => {
	if (!(obj instanceof Object)) return obj
	const next = {}

	for (const key in obj) {
		if (has(obj, key)) {
			if (obj[key] instanceof Object) {
				if (Array.isArray(obj[key])) {
					next[key] = obj[key].map(toJson)
				} else {
					next[key] = toJson(obj[key])
				}
			} else {
				next[key] = obj[key]
			}
		}
	}

	return next
}
