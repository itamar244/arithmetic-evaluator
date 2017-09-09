// @flow
import { parse } from '../../'
import { op, expr, item, func } from './utils'

const expressions = [
	['3+3', op('+', item('Literal', '3'), item('Literal', '3'))],

	['x+x*x^x',
		op('+',
			item('Parameter', 'x'),
			op('*',
				item('Parameter', 'x'),
				op('^',
					item('Parameter', 'x'),
					item('Parameter', 'x'),
				),
			),
		),
	],

	['y (( y + y ))',
		op('*',
			item('Parameter', 'y'),
			expr(
				expr(
					op('+',
						item('Parameter', 'y'),
						item('Parameter', 'y'),
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

	['#',	item('NonParsable', '#')],
	['(',	item('NonParsable', '(')],

	['x=3', op('=',
		item('Parameter', 'x'),
		item('Literal', '3'),
	)],

	['xxx', [
		op('*',
			op('*',
				item('Parameter', 'x'),
				item('Parameter', 'x'),
			),
			item('Parameter', 'x'),
		),
	]],
]

describe('parse method', () => {
	for (const [blob, trees] of expressions) {
		const { expression } = parse(blob)

		// eslint-disable-next-line no-loop-func
		it(`${blob} should be the correct tree`, () => {
			if (trees instanceof Array) {
				for (let i = 0; i < trees.length; i += 1) {
					expect(expression.body).toMatchObject(trees[i])
				}
			} else {
				expect(expression.body).toMatchObject(trees)
			}
		})
	}
})
