// @flow
import test from 'ava'
import { run } from '../index'

test('programs should work', (t) => {
	const inputs = [
		['3-3+ (3+3*3^3)( 2 - 1 ) + cos(PI)', 83],
		['cos(PI)', -1],
		['3 / 2', 3 / 2],
		['13.3 % 4', 13.3 % 4],
		['|-3|', 3],
		['+3-3', 0],
		['4!', 24],
		['func cube(x) x ^ 2; cube(cube(2))', 16],
		['let x = 10, y = 5 in x - y', 10 - 5],
		['let x = 10 in 3x', 3 * 10],
		['x=3', NaN],
	]

	for (const [input, val] of inputs) {
		t.is(run(input), val, `running ${input}`)
	}
})

test('progams should throw', (t) => {
	const inputs = [
		['cube(3)', 'cube is not a function'],
		['x+3', 'x is undefined'],
	]

	for (const [input, error] of inputs) {
		t.throws(() => run(input), error)
	}
})

// const equations = [
// 	['2x=x+2', 2],
// 	['x=sqrt(2)', Math.sqrt(2)],
// ]
//
// test('should equations work', (t) => {
// 	for (const [expr, val] of equations) {
// 		const program = parse(expr)
// 		const expression = program.body[0]
//
// 		t.truthy(expression)
// 		if (expression.type === 'Expression') {
// 			t.is(expression.body.type, 'Equation')
// 			if (expression.body.type === 'Equation') {
// 				t.is(evaluate(program), val)
// 			}
// 		}
// 	}
// })
