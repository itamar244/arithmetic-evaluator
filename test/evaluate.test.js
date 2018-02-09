// @flow
import test from 'ava'
import { run, createRepl } from '../src'

test('programs should work', (t) => {
	const importSquare = 'import "test/imported-files/square.art";'
	const inputs = [
		['3-3+ (3+3*3^3)( 2 - 1 ) + cos(PI)', 83],
		['cos(PI)', -1],
		['3 / 2', 3 / 2],
		['13.3 % 4', 13.3 % 4],
		['|-3|', 3],
		['+3-3', 0],
		// ['3!', 24], // FIXME: for some reason can not parse in program
		['func cube(x) x ^ 2; cube(cube(2))', 16],
		['(3+3); 3', 3],
		['let x = 10, y = 5 in x - y', 10 - 5],
		['let x = 10 in 3x', 3 * 10],
		['let x = 3 in 3x+3', 12],
		// tests for custom builtin functions
		['fib(10)', 89],
		['fib(0)', 0],
		['fact(4)', 24],
		// tests for linker
		[`${importSquare} square(3)`, 9],
	]

	for (const [input, val] of inputs) {
		t.is(run(input), val, `running ${input}`)
	}
})

test('progams should throw', (t) => {
	const inputs = [
		['cube(3)', 'cube is not a function'],
		['x', 'x is undefined'],
		['func x(x) x; x(2, 3)', "wrong number of arguments: 'x' needed 1, intead of 2"],
		['func x(x) x; func x(x) x', 'function x is already defined'],
	]

	for (const [input, error] of inputs) {
		t.throws(() => run(input), error)
	}
})

test('repl should work', (t) => {
	const repl = createRepl()
	const lines = [
		['func root(x) x^2', null],
		['func pow(x, y) x^y', null],
		['root(2)', 4],
		['pow(10, 2)', 100],
	]

	for (const [line, value] of lines) {
		t.is(repl(line), value, `running '${line}' on repl`)
	}
})
