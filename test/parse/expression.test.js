// @flow
import test from 'ava'
import { parse } from '../../src'
import * as n from './nodes'

const expressions = [
	['3+3', n.BinaryExpression([0, 3], '+',
		n.NumericLiteral([0, 1], 3),
		n.NumericLiteral([2, 3], 3),
	)],

	['x+x*x^x', n.BinaryExpression([0, 7], '+',
		n.Identifier([0, 1], 'x'),
		n.BinaryExpression([2, 7], '*',
			n.Identifier([2, 3], 'x'),
			n.BinaryExpression([4, 7], '^',
				n.Identifier([4, 5], 'x'),
				n.Identifier([6, 7], 'x'),
			),
		),
	)],

	['max(3, PI)', n.CallExpression('max', [0, 3], [0, 10],
		n.NumericLiteral([4, 5], 3),
		n.Identifier([7, 9], 'PI'),
	)],

	['| - 3 |', n.Parenthesized([0, 7], true,
		n.UnaryExpression([2, 5], '-', true, n.NumericLiteral([4, 5], 3)),
	)],

	['x=3', n.Equation([0, 3],
		n.Identifier([0, 1], 'x'),
		n.NumericLiteral([2, 3], 3),
	)],

	['x x x', n.BinaryExpression([0, 5], '*',
		n.Identifier([0, 1], 'x'),
		n.BinaryExpression([2, 5], '*',
			n.Identifier([2, 3], 'x'),
			n.Identifier([4, 5], 'x'),
		),
	)],
]

const statements = [
	['let i=3 in i+i', n.VariableDeclerations([0, 14],
		[['i', n.NumericLiteral([6, 7], 3)]],
		n.BinaryExpression([11, 14], '+',
			n.Identifier([11, 12], 'i'),
			n.Identifier([13, 14], 'i'),
		),
	)],

	['import "index"', n.Import([0, 14], 'index')],
]

test('should parse expressions and statements fine', (t) => {
	// wrap expressions in Expression and concat them with statements
	// to run all parse checks
	const toCheck = expressions
		.map(item => [item[0], n.Expression(item[1])])
		.concat(statements)

	for (const [input, tree] of toCheck) {
		const program = parse(input)
		const expression = program.body[0]

		t.deepEqual(program.loc, expression.loc)
		t.deepEqual(tree, expression, `parsing ${input}`)
	}
})

test('should parse comments fine', (t) => {
	const input = `
		# asdfasdf
		func root(x) x ^ 2;
		# asdfasdf
		# asdfasdf
		root(x);
		# asdfasdf
	`
	t.is(parse(input).body.length, 2)
})

const throwables = [
	['(', 1, "'eof' unexpected token"],
	['@', 0, "'@' unexpected token"],
	['*3', 0, "'*' can't be an unary operator"],
	['(x=3)', 2, "'=' unexpected token"],
	['3)', 1, "')' unexpected token"],
	['func y(x x) x ^ 2', 9, "'x' unexpected token"],
	['(3|', 2, "'|' unexpected token"],
	['"333', 0, "'\"333' unterminated string"],
	['import', 6, 'expected a string after import'],
]

test('should throw execptions', (t) => {
	for (const [input, pos, _error] of throwables) {
		const error = `at anonymous, 0:${pos} - ${_error}`

		t.throws(() => parse(input), error, error)
	}
})
