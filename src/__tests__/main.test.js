// @flow
import { parse, run, evaluate } from '../index'

const expressions = [
	['3-3+ (3+3*3^3)( 2 - 1 ) + cos(PI)', 83],
	['cos(PI)', -1],
	['3 / 2', 3 / 2],
	['13.3 % 4', 13.3 % 4],
	['let x = 10, y = 5 in x - y', 10 - 5],
]

describe('should expression work', () => {
	for (const [expr, val] of expressions) {
		it(expr, () => {
			expect(run(expr)).toBe(val)
		})
	}
})

const equations = [
	['2x=x+2', 2],
	['x=sqrt(2)', Math.sqrt(2)],
]

describe('should equations work', () => {
	for (const [expr, val] of equations) {
		it(expr, () => {
			const program = parse(expr)
			const expression = program.body[0]

			expect(expression).toBeTruthy()
			if (expression.type === 'Expression') {
				expect(expression.body.type === 'Equation').toBe(true)
				if (expression.body.type === 'Equation') {
					expect(evaluate(program)).toBe(val)
				}
			}
		})
	}
})
