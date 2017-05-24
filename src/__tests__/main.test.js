// @flow
/* eslint-env jest */
import { evaluate, parse } from '../'
import { Node } from '../parser/node'
import * as tt from '../parser/types'

it("'3+3*3^3' should be equal 84", () => {
	const res = parse('3+3*3^3')

	expect(res.type).toBe('EXPRESSION')

	expect(res).toMatchObject({
		type: 'EXPRESSION',
		body: [
			new Node(tt.NUMBER, '3'),
			new Node(tt.OPERATOR, '+'),
			[
				new Node(tt.NUMBER, '3'),
				new Node(tt.OPERATOR, '*'),
				[
					new Node(tt.NUMBER, '3'),
					new Node(tt.OPERATOR, '^'),
					new Node(tt.NUMBER, '3'),
				],
			],
		],
	})

	if (res.type === 'EXPRESSION') {
		expect(evaluate(res.body)).toBe(84)
	}
})
