// @flow
import * as N from '../types'
import { types as tt } from '../tokenizer/types'
import ExpressionParser from './expression'

export default class StatementParser extends ExpressionParser {
	parseTopLevel(program: N.Program): N.Program {
		this.nextToken()

		program.body = []
		while (!this.match(tt.eof)) {
			program.body.push(this.parseStatement())
			this.semicolon()
		}
		return this.finishNode(program, 'Program')
	}

	parseStatement() {
		const node = this.startNode()

		switch (this.state.type) {
			case tt.let:
				return this.parseVariableDeclarations(node)
			case tt.func:
				return this.parseFunction(node)
			default:
				return this.parseExpressionStatement(node)
		}
	}

	parseExpressionStatement(node: N.Expression) {
		node.body = this.parseExpressionBody(true)
		return this.finishNode(node, 'Expression')
	}

	parseVariableDeclarations(node: N.VariableDeclerations) {
		node.declarations = []

		let end = false
		while (!end) {
			node.declarations.push(this.parseVarDeclarator())
			if (this.eat(tt.in)) {
				end = true
			} else {
				this.expect(tt.comma)
			}
		}
		node.expression = this.parseExpressionStatement(this.startNode())
		return this.finishNode(node, 'VariableDeclerations')
	}

	parseVarDeclarator(): N.VariableDeclerator {
		this.expectNext(tt.name)
		const node: N.VariableDeclerator = this.startNode()
		node.id = this.parseIdentifier(this.startNode())
		this.expectNext(tt.eq)
		this.next()
		node.init = this.parseExpressionBody(false)
		return this.finishNodeAt(
			node,
			'VariableDeclerator',
			this.state.prevEnd,
			this.state.prevEndLoc,
		)
	}

	parseFunction(node: N.FunctionDeclaration) {
		node.params = []
		this.expectNext(tt.name)
		node.id = this.parseIdentifier(this.startNode())

		let end = false
		this.expectNext(tt.parenL)
		while (!end) {
			this.expectNext(tt.name)
			node.params.push(this.parseIdentifier(this.startNode()))
			this.next()
			if (this.eat(tt.parenR)) {
				end = true
			} else if (!this.eat(tt.comma)) {
				this.unexpected()
			}
		}

		node.body = this.parseExpressionBody(false)

		return this.finishNode(node, 'FunctionDeclaration')
	}
}
