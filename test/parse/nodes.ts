// @flow
import * as N from '../../src/types'
import { Position } from '../../src/utils/location'
import { Node } from '../../src/parser/node'

type Location = [number, number]

function createNode<T extends N.Node>(
	type: T['type'],
	loc: Location,
	extra: Object,
): T {
	const start = new Position(0, loc[0])
	const end = new Position(0, loc[1])
	const node: T = Object.assign(new Node(start, loc[0]), extra) as any

	node.type = type
	node.end = loc[1]
	node.loc.end = end

	return node
}

const nodeCreator =
	<T extends N.Node>(type: T['type'], propNames: string[]) =>
		(loc: Location, ...props: any[]) => {
			const extra = {}

			for (let i = 0; i < propNames.length; i += 1) {
				extra[propNames[i]] = props[i]
			}

			return createNode(type, loc, extra)
		}

export const Import = nodeCreator('Import', ['path'])
export const BinaryExpression = nodeCreator(
	'BinaryExpression',
	['operator', 'left', 'right'],
)
export const UnaryExpression = nodeCreator(
	'UnaryExpression',
	['operator', 'prefix', 'argument'],
)
export const Identifier = nodeCreator('Identifier', ['name'])
export const NumericLiteral = nodeCreator('NumericLiteral', ['value'])
export const Parenthesized = nodeCreator('Parenthesized', ['abs', 'body'])

export const Expression = (body: N.AnyNode): N.Expression => createNode(
	'Expression',
	[body.start, body.end],
	{ body },
)

export const CallExpression = (
	name: string,
	calleLoc: Location,
	loc: Location,
	...args: N.Node[]
) => createNode(
	'CallExpression',
	loc,
	{ args, callee: Identifier(calleLoc, name), typeArgs: null, },
)

export const VariableDeclerations = (
	loc: Location,
	decls: Array<[string, N.Node]>,
	expression: N.Node,
): N.VariableDeclerations => createNode(
	'VariableDeclerations',
	loc,
	{
		declarations: decls.map(decl => VariableDeclerator(decl[0], decl[1])),
		expression: Expression(expression),
	},
)

export const VariableDeclerator =
	(name: string, init: N.Node): N.VariableDeclerator => {
		const id = Identifier(
			[init.start - 1 - name.length, init.start - 1],
			name,
		)

		return createNode(
			'VariableDeclerator',
			[init.start - 1 - name.length, init.end],
			{ id, init },
		)
	}

export const Equation = (
	loc: Location,
	left: N.Node,
	right: N.Node,
): N.Equation => createNode(
	'Equation',
	loc,
	{ left, right, operator: '=' },
)
