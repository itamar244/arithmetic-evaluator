// @flow
import test from 'ava'
import { parse } from '../../src'
import {
	varDecls,
	eq,
	binary,
	unary,
	expr,
	num,
	identifer,
	item,
	call,
	imp,
	nodeToJson,
} from './nodes'

const expressions = [
	['3+3', expr(
		binary('+', [0, 3],
			num([0, 1], 3),
			num([2, 3], 3),
		),
	)],

	['x+x*x^x', expr(
		binary('+', [0, 7],
			identifer([0, 1], 'x'),
			binary('*', [2, 7],
				identifer([2, 3], 'x'),
				binary('^', [4, 7],
					identifer([4, 5], 'x'),
					identifer([6, 7], 'x'),
				),
			),
		),
	)],

	['max(3, PI)', expr(
		call('max', [0, 3], [0, 10],
			num([4, 5], 3),
			identifer([7, 9], 'PI'),
		),
	)],

	['| - 3 |', expr(
		item('AbsParentheses', [0, 7],
			'body',
			unary('-', [2, 5], true, num([4, 5], 3)),
		),
	)],

	['x=3', expr(
		eq([0, 3],
			identifer([0, 1], 'x'),
			num([2, 3], 3),
		),
	)],

	['x x x', expr(
		binary('*', [0, 5],
			identifer([0, 1], 'x'),
			binary('*', [2, 5],
				identifer([2, 3], 'x'),
				identifer([4, 5], 'x'),
			),
		),
	)],

	['let i=3 in i+i', varDecls([0, 14],
		[['i', num([6, 7], 3)]],
		binary('+', [11, 14],
			identifer([11, 12], 'i'),
			identifer([13, 14], 'i'),
		),
	)],

	['import "index"', imp([0, 14], 'index')],
]

test('should parse expressions fine', (t) => {
	for (const [input, tree] of expressions) {
		const program = parse(input)
		const expression = program.body[0]

		t.deepEqual(program.loc, expression.loc)
		t.deepEqual(tree, nodeToJson(expression), `parsing ${input}`)
	}
})

test('should parse comments fine', (t) => {
	const input = `
		func root(x) x ^ 2;
		# asdfasdf
		# asdfasdf
		root(x);
	`

	t.is(parse(input).body.length, 2)
})

const throwables = [
	['(', "1 - 'eof': unexpected token"],
	['@', "0 - '@': unexpected token"],
	['*3', "0 - '*' can't be an unary operator"],
	['(x=3)', "2 - '=': unexpected token"],
	['3)', "1 - ')': unexpected token"],
	['func y(x x) x ^ 2', "9 - 'x': unexpected token"],
	['(3|', "2 - '|': unexpected token"],
	['"333', "0 - '\"333' unterminated string"],
	['import', '6 - expected a string after import'],
]

test('should throw execptions', (t) => {
	for (const [blob, error] of throwables) {
		t.throws(() => parse(blob), `anonymous: ${error}`, error)
	}
})
