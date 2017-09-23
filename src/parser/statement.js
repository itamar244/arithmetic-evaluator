// @flow
import type {
	Node,
	Result,
	Expression,
} from '../types'
import { types as tt, type TokenType } from '../tokenizer/types'
import ExpressionParser from './expression'
import mergeNodes from './util'

export default class StatementParser extends ExpressionParser {
	parseTopLevel(result: Result): Result {
		const expression = this.startNode()
		expression.body = this.parseExpressionBody(true)

		result.expression = this.finishNode(expression, 'Expression')
		result.identifiers = [...this.state.identifiers]
		return this.finishNode(result, 'Result')
	}

	parseExpressionBody(topLevel?: bool, breakers?: TokenType[]): ?Node {
		const nextToken = nextNode => (
			node = mergeNodes(nextNode, node)
		)
		let node: ?Node = null

		this.next()
		while (
			(breakers == null || !breakers.includes(this.state.type))
			&& this.state.type !== tt.eof
		) {
			// a parser support for multiplier shortcut
			// checks if the token isn't left parentheses (for function calls) or operator
			if (
				this.state.type !== tt.operator
				&& this.state.type !== tt.eq
				&& (this.state.type !== tt.parenL || this.state.prevSpacePadding > 0)
				&& node !== null && this.state.prevType !== tt.operator
			) {
				const multiplier = this.startNode()
				multiplier.operator = '*'
				nextToken(this.parseBinaryOperator(multiplier, !!topLevel, false))
			} else {
				const nextNode = this.parseToken(!!topLevel, node)
				if (nextNode.type === 'Equation') {
					node = nextNode
				} else {
					nextToken(nextNode)
				}
			}
			this.next()
		}

		return node
	}
}
