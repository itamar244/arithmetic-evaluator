// @flow
import type { Result, Expression } from '../types'
import { types as tt, type TokenType } from '../tokenizer/types'
import ExpressionParser from './expression'

export default class Parser extends ExpressionParser {
	parse(input: string): Result {
		this.state.init(input)
		const result: Result = this.startNode()
		const expression: Expression = this.startNode()

		expression.body = this.parseExpression(true, [tt.eof, tt.colon])

		result.expression = this.finishNode(expression, 'Expression')
		result.identifiers = this.state.identifiers
		result.params = this.parseParametersList()
		return this.finishNode(result, 'Result')
	}
}
