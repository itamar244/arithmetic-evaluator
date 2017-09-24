// @flow
import type { Result, Expression } from '../types'
import { types as tt, type TokenType } from '../tokenizer/types'
import ExpressionParser from './expression'

export default class Parser extends ExpressionParser {
	input: string

	constructor(input: string) {
		super(input)
		this.input = input
	}

	parse(): Result {
		const result: Result = this.startNode()
		const expression: Expression = this.startNode()

		expression.body = this.parseExpression(true, [tt.eof])
		result.expression = this.finishNode(expression, 'Expression')
		result.identifiers = this.state.identifiers
		return this.finishNode(result, 'Result')
	}
}
