// @flow
import type { Location } from '../../types'
import { has } from '../../utils'

type Item = {
	type: string;
	loc: Location,
}
type ArrayLocation = [number, number]

export const eq = (left: Item, right: Item) => ({
	type: 'Equation',
	left,
	right,
})

export const varDecls = (decls: Array<[string, Item]>, loc: ArrayLocation, body: Item) => ({
	declarations: decls.map(decl => ({
		id: item('Identifier',
		[decl[1].loc.start - 1 - decl[0].length, decl[1].loc.start - 1],
		'name',
		decl[0],
	),
		init: decl[1],
	})),
	expression: item('Expression', loc, 'body', body),
})

export const binary = (operator: string, loc: ArrayLocation, left: Item, right: Item) => ({
	operator,
	left,
	right,
	loc: { start: loc[0], end: loc[1] },
	type:'BinaryExpression',
})

export const unary = (operator: string, loc: ArrayLocation, prefix: bool, argument: Item) => ({
	operator,
	prefix,
	argument,
	loc: { start: loc[0], end: loc[1] },
	type: 'UnaryExpression',
})

export const item = (
	type: string,
	loc: ArrayLocation,
	key: string,
	value: mixed,
): Item => ({
	type,
	loc: { start: loc[0], end: loc[1] },
	[key]: value,
})

export const expr = (loc: ArrayLocation, body: Item): Item => (
	item('Expression', loc, 'body', body)
)

export const func = (
	name: string,
	calleLoc: ArrayLocation,
	loc: ArrayLocation,
	...args: Item[]
) => ({
	args,
	loc: { start: loc[0], end: loc[1] },
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
