// @flow
import { parse, evaluateExpression, evaluateEquation } from '../'

const expressions = [
	['3-3+ (3+3*3^3)( 2 - 1 ) + cos(PI)', 83, {}],
	['cos(PI)', -1, {}],
	['3 / 2', 3 / 2, {}],
	['13.3 % 4', 13.3 % 4, {}],
	['x - y', 10 - 5, { x: 10, y: 5 }],
]

it('should expression work', () => {
	for (const [expr, val, params = {}] of expressions) {
		const parsed = parse(expr)

		expect(evaluateExpression(parsed.trees[0].body, params)).toBe(val)
	}
})

const equations = [
	['2x=x+2', 2],
	['x=sqrt(2)', Math.sqrt(2)],
]

it('should equations work', () => {
	for (const [expr, val] of equations) {
		const parsed = parse(expr)

		expect(
			evaluateEquation(
				parsed.trees,
				[...parsed.state.params][0],
			),
		).toBe(val)
	}
})
