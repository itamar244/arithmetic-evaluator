// @flow
import * as N from '../types'
import { types as tt } from '../tokenizer/types'
import ExpressionParser from './expression'

export default class StatementParser extends ExpressionParser {
	parseTopLevel(result: N.Result) {
		this.nextToken()
		result.expression = this.parseStatement()
		result.identifiers = this.state.identifiers
		return this.finishNode(result, 'Result')
	}

	parseStatement() {
		const node = this.startNode()

		switch (this.state.type) {
			case tt.let:
				return this.parseVariableDeclarations(node)
			default:
				return this.parseExpression(node, tt.eof, true)
		}
	}

	parseVariableDeclarations(node: N.VariableDeclerations) {
		node.declarations = []

		let end = false
		while (!end) {
			node.declarations.push(this.parseVarDeclarator())
			if (this.eat(tt.in)) {
				end = true
			} else {
				this.expect(this.match(tt.comma))
			}
		}
		node.expression = this.parseExpression(this.startNode(), tt.eof, true)
		return this.finishNode(node, 'VariableDeclerations')
	}

	parseVarDeclarator(): N.VariableDeclerator {
		this.expectNext(tt.name)
		const node: N.VariableDeclerator = this.startNode()
		node.id = this.parseIdentifier(this.startNode())
		this.expectNext(tt.eq)
		this.next()
		node.init = this.parseExpressionBody(false, [tt.in, tt.comma])
		return node
	}
}
