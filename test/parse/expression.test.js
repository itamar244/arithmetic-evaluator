// @flow
import test from 'ava'
import { parse } from '../../src'
import * as n from '../../src/nodes'
import * as utils from './node-utils'

const expressions = [
	['3+3', new n.BinaryExpression('+',
		new n.NumericLiteral(3),
		new n.NumericLiteral(3),
	)],

	['x+x*x^x', new n.BinaryExpression('+',
		new n.Identifier('x'),
		new n.BinaryExpression('*',
			new n.Identifier('x'),
			new n.BinaryExpression('^',
				new n.Identifier('x'),
				new n.Identifier('x'),
			),
		),
	)],

	['max(3, PI)', new n.CallExpression(new n.Identifier('max'), [
		new n.NumericLiteral(3),
		new n.Identifier('PI'),
	])],

	['| - 3 |', new n.Expression(
		new n.UnaryExpression('-', new n.NumericLiteral(3), true),
		true,
	)],

	// ['x=3', new n.Equation(
	// 	new n.Identifier('x'),
	// 	new n.NumericLiteral(3),
	// )],

	['x x x', new n.BinaryExpression('*',
		new n.Identifier('x'),
		new n.BinaryExpression('*',
			new n.Identifier('x'),
			new n.Identifier('x'),
		),
	)],
]
const statements = [
	['let i=3 in i+i', utils.variableDeclarations(
		[['i', new n.NumericLiteral(3)]],
		new n.BinaryExpression('+',
			new n.Identifier('i'),
			new n.Identifier('i'),
		),
	)],

	['import "index"', new n.Import('index')],
]

test('should parse expressions and statements fine', (t) => {
	// wrap expressions in Expression and concat them with statements
	// to run all parse checks
	const toCheck = expressions
		.map(item => [item[0], new n.Expression(item[1])])
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
