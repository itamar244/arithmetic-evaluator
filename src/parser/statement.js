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
			case tt.import:
				return this.parseImport(node)
			case tt.let:
				return this.parseVariableDeclarations(node)
			case tt.func:
				return this.parseFunction(node)
			default:
				return this.parseExpressionStatement(node)
		}
	}

	parseImport(node: N.Import): N.Import {
		this.next()
		if (!this.match(tt.string)) this.unexpected('expected a string after import')
		node.path = this.state.value
		this.next()

		return this.finishNode(node, 'Import')
	}

	parseExpressionStatement(node: N.Expression) {
		node.body = this.parseExpressionBody(true)
		return this.finishNode(node, 'Expression')
	}

	parseVariableDeclarations(node: N.VariableDeclerations) {
		node.declarations = []

		let end = false
		this.next()
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
		if (!this.match(tt.name)) this.unexpected()
		const node: N.VariableDeclerator = this.startNode()
		node.id = this.parseIdentifier(this.startNode())
		this.expect(tt.eq)
		node.init = this.parseExpressionBody(false)
		return this.finishNode(node, 'VariableDeclerator')
	}

	parseFunction(node: N.FunctionDeclaration) {
		node.params = []

		this.next()
		if (!this.match(tt.name)) this.unexpected('need a name for func declaration')
		node.id = this.parseIdentifier(this.startNode())

		this.expect(tt.parenL)
		while (!this.eat(tt.parenR)) {
			if (!this.match(tt.name)) this.unexpected()
			node.params.push(this.parseIdentifier(this.startNode()))
			if (!this.match(tt.parenR)) {
				this.expect(tt.comma)
			}
		}

		node.body = this.parseExpressionBody(false)

		return this.finishNode(node, 'FunctionDeclaration')
	}
}
