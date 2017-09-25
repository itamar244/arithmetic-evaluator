// @flow
import { parse } from '../../'
import { eq, varDecls, op, expr, item, func } from './utils'

const expressions = [
	['3+3', item('Expression', 'body',
		op('+', item('Literal', 'value', 3), item('Literal', 'value', 3)),
	)],

	['x+x*x^x', item('Expression', 'body',
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
	)],

	['y * (( y + y ))', item('Expression', 'body',
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
	)],

	['max(3, PI)', item('Expression', 'body',
		func('max',
			item('Literal', 'value', 3),
			item('Identifier', 'name', 'PI'),
		),
	)],

	['| - 3 |', item('Expression', 'body',
		item('AbsParentheses',
			'body',
			op('-',	undefined, item('Literal', 'value', 3)),
		),
	)],

	['x=3', item('Expression', 'body', eq(
		item('Identifier', 'name', 'x'),
		item('Literal', 'value', 3),
	))],

	['x x x', item('Expression', 'body',
		op('*',
			item('Identifier', 'name', 'x'),
			op('*',
				item('Identifier', 'name', 'x'),
				item('Identifier', 'name', 'x'),
			),
		),
	)],

	['let i = 3 in i + i', varDecls(
		[['i', item('Literal', 'value', 3)]],
		op('+',
			item('Identifier', 'name', 'i'),
			item('Identifier', 'name', 'i'),
		),
	)],
]

describe('parse method', () => {
	for (const [blob, tree] of expressions) {
		it(`${blob} should be the correct tree`, () => {
			const { expression } = parse(blob)

			expect(expression).toMatchObject(tree)
		})
	}
})

const throwables = [
	['#'],
	['(', "1 - eof: unexpected token"],
]

describe('parse execptions', () => {
	for (const [blob, error] of throwables) {
		it(`${blob} should throw`, () => {
			expect(() => parse(blob)).toThrow(error || `0 - ${blob[0]}: unexpected token`)
		})
	}
})
