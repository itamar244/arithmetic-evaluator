// @flow
import { parse } from '../../'
import { op, expr, item, func } from './utils'

const expressions = [
	['3+3', op('+', item('Literal', '3'), item('Literal', '3'))],

	['x+x*x^x',
		op('+',
			item('Identifier', 'x'),
			op('*',
				item('Identifier', 'x'),
				op('^',
					item('Identifier', 'x'),
					item('Identifier', 'x'),
				),
			),
		),
	],

	['y (( y + y ))',
		op('*',
			item('Identifier', 'y'),
			expr(
				expr(
					op('+',
						item('Identifier', 'y'),
						item('Identifier', 'y'),
					),
				),
			),
		),
	],

	['max(3, PI)',
		func('max',
			item('Literal', '3'),
			item('Constant', 'PI'),
		),
	],

	['| - 3 |',
		func('cos',
			op('-',	undefined, item('Literal', '3')),
		),
	],

	['x=3', op('=',
		item('Identifier', 'x'),
		item('Literal', '3'),
	)],

	['xxx',
		op('*',
			op('*',
				item('Identifier', 'x'),
				item('Identifier', 'x'),
			),
			item('Identifier', 'x'),
		),
	],
]

describe('parse method', () => {
	for (const [blob, tree] of expressions) {
		const { expression } = parse(blob)

		it(`${blob} should be the correct tree`, () => {
			expect(expression.body).toMatchObject(tree)
		})
	}
})

const throwables = [
	['#',	item('NonParsable', '#')],
	['(',	item('NonParsable', '(')],
]

describe('parse execptions', () => {
	for (const [blob, tree] of throwables) {
		it(`${blob} should throw`, () => {
			expect(() => parse(blob)).toThrow(`0 - ${blob[0]}: not a valid token`)
		})
	}
})
