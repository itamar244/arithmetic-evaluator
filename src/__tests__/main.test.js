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
		const { expression } = parse(expr)

		expect(evaluateExpression(expression.body, params)).toBe(val)
	}
})

const equations = [
	['2x=x+2', 2],
	['x=sqrt(2)', Math.sqrt(2)],
]

describe('should equations work', () => {

	for (const [expr, val] of equations) {
		it(`${expr}: ${val}`, () => {
				const result = parse(expr)
				const { body } = result.expression

				expect(body.type === 'BinaryOperator' && body.operator === '=').toBe(true)
				if (body.type === 'BinaryOperator') {
					expect(evaluateEquation(body, result.params[0])).toBe(val)
				}
		})
	}
})
