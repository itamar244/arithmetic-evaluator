// @flow
import type {
	Node,
	Result,
} from '../types'
import * as tt from '../tokenizer/types'
import ExpressionParser from './expression'
import mergeNodes from './util'

export default class StatementParser extends ExpressionParser {
	parseTopLevel(result: Result): Result {
		result.expression = this.createExpression(this.parseExpressionBody(true))
		result.identifiers = [...this.state.identifiers]
		return this.finishNode(result, 'Result')
	}

	parseExpressionBody(topLevel?: bool, breakers?: tt.TokenType[]): ?Node {
		const nextToken = (nextNode) => {
			node = mergeNodes(nextNode, node)
			this.state.prevNode = nextNode
		}
		let node: ?Node = null

		this.next()
		while (
			(breakers == null || !breakers.includes(this.state.type))
			&& this.state.type !== tt.EOF
		) {
			// a parser support for multiplier shortcut
			// checks if the token isn't left parentheses (for function calls) or operator
			if (
				this.state.type !== tt.OPERATOR
				&& (this.state.type !== tt.PAREN_L || this.state.prevSpacePadding > 0)
				&& node !== null && this.state.prevType !== tt.OPERATOR
			) {
				nextToken(this.parseOperator(this.startNode(), node, '*'))
			}
			nextToken(this.parseToken(!!topLevel))
			this.next()
		}

		return node
	}
}
