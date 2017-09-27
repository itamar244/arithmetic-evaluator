// @flow
import test from 'ava'
import { parse } from '../src'
import {
	// eq,
	// varDecls,
	toJson,
	binary,
	unary,
	expr,
	item,
	func,
} from './nodes'

const expressions = [
	['3+3', expr([0, 3],
		binary('+', [0, 3],
			item('Literal', [0, 1], 'value', 3),
			item('Literal', [2, 3], 'value', 3),
		),
	)],

	['x+x*x^x', item('Expression', [0, 7], 'body',
		binary('+', [0, 7],
			item('Identifier', [0, 1], 'name', 'x'),
			binary('*', [2, 7],
				item('Identifier', [2, 3], 'name', 'x'),
				binary('^', [4, 7],
					item('Identifier', [4, 5], 'name', 'x'),
					item('Identifier', [6, 7], 'name', 'x'),
				),
			),
		),
	)],
	//
	// ['y * (( y + y ))', item('Expression', 'body',
	// 	binary('*',
	// 		item('Identifier', 'name', 'y'),
	// 		expr(
	// 			expr(
	// 				binary('+',
	// 					item('Identifier', 'name', 'y'),
	// 					item('Identifier', 'name', 'y'),
	// 				),
	// 			),
	// 		),
	// 	),
	// )],
	//
	['max(3, PI)', expr([0, 10],
		func('max', [0, 3], [3, 10],
			item('Literal', [4, 5], 'value', 3),
			item('Identifier', [7, 9], 'name', 'PI'),
		),
	)],

	['| - 3 |', expr([0, 7],
		item('AbsParentheses', [0, 7],
			'body',
			unary('-', [2, 5], true, item('Literal', [4, 5], 'value', 3)),
		),
	)],
	//
	['x=3', expr([0, 3], binary('=', [0, 3],
		item('Identifier', [0, 1], 'name', 'x'),
		item('Literal', [2, 3], 'value', 3),
	))],
	//
	// ['x x x', item('Expression', 'body',
	// 	binary('*',
	// 		item('Identifier', 'name', 'x'),
	// 		binary('*',
	// 			item('Identifier', 'name', 'x'),
	// 			item('Identifier', 'name', 'x'),
	// 		),
	// 	),
	// )],
	//
	// ['let i = 3 in i + i', varDecls(
	// 	[['i', item('Literal', 'value', 3)]],
	// 	binary('+',
	// 		item('Identifier', 'name', 'i'),
	// 		item('Identifier', 'name', 'i'),
	// 	),
	// )],
]

test('parse method', (t) => {
	for (const [blob, tree] of expressions) {
		const program = parse(blob)
		const expression = program.body[0]

		t.deepEqual(tree, toJson(expression), `parsing ${blob}`)
	}
})

const throwables = [
	['#', "0 - '#': unexpected token"],
	['(', "1 - 'eof': unexpected token"],
	['*3', "0 - '*' can't be an unary operator"],
	['(x=3)', "2 - '=': unexpected token"],
]

test('parse execptions', (t) => {
	for (const [blob, error] of throwables) {
		t.throws(() => parse(blob), error, error)
	}
})
