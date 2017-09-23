// @flow
import { parse } from '../../'
import { eq, op, expr, item, func } from './utils'

const expressions = [
	['3+3', op('+', item('Literal', 'value', 3), item('Literal', 'value', 3))],

	['x+x*x^x',
		op('+',
			item('Identifier', 'name', 'x'),
			op('*',
				item('Identifier', 'name', 'x'),
				op('^',
					item('Identifier', 'name', 'x'),
					item('Identifier', 'name', 'x'),
				),
			),
		),
	],

	['y * (( y + y ))',
		op('*',
			item('Identifier', 'name', 'y'),
			expr(
				expr(
					op('+',
						item('Identifier', 'name', 'y'),
						item('Identifier', 'name', 'y'),
					),
				),
			),
		),
	],

	['max(3, PI)',
		func('max',
			item('Literal', 'value', 3),
			item('Identifier', 'name', 'PI'),
		),
	],

	['| - 3 |',
		item('AbsParentheses',
			'body',
			op('-',	undefined, item('Literal', 'value', 3)),
		),
	],

	['x=3', eq(
		item('Identifier', 'name', 'x'),
		item('Literal', 'value', 3),
	)],

	['x x x',
		op('*',
			op('*',
				item('Identifier', 'name', 'x'),
				item('Identifier', 'name', 'x'),
			),
			item('Identifier', 'name', 'x'),
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
	['#'],
	['(', "0 - '(': no matching closing parentheses"],
]

describe('parse execptions', () => {
	for (const [blob, error] of throwables) {
		it(`${blob} should throw`, () => {
			expect(() => parse(blob)).toThrow(error || `0 - ${blob[0]}: not a valid token`)
		})
	}
})
