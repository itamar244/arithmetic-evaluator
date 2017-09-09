// @flow
import { parse } from '../../'
import * as tt from '../../tokenizer/types'
import { op, expr, item, func } from './utils'

const expressions = [
	['3+3', op('+', item(tt.LITERAL, '3'), item(tt.LITERAL, '3'))],

	['x+x*x^x',
		op('+',
			item(tt.PARAM, 'x'),
			op('*',
				item(tt.PARAM, 'x'),
				op('^',
					item(tt.PARAM, 'x'),
					item(tt.PARAM, 'x'),
				),
			),
		),
	],

	['y (( y + y ))',
		op('*',
			item(tt.PARAM, 'y'),
			expr(
				expr(
					op('+',
						item(tt.PARAM, 'y'),
						item(tt.PARAM, 'y'),
					),
				),
			),
		),
	],

	['max(3, PI)',
		func('max',
			item(tt.LITERAL, '3'),
			item(tt.CONSTANT, 'PI'),
		),
	],

	['| - 3 |',
		func('cos',
			op('-',	undefined, item(tt.LITERAL, '3')),
		),
	],

	['#',	item(tt.NONPARSABLE, '#')],
	['(',	item(tt.NONPARSABLE, '(')],

	['x=3', op('=',
		item(tt.PARAM, 'x'),
		item(tt.LITERAL, '3'),
	)],

	['xxx', [
		op('*',
			op('*',
				item(tt.PARAM, 'x'),
				item(tt.PARAM, 'x'),
			),
			item(tt.PARAM, 'x'),
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
