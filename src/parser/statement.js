// @flow
import * as N from '../types'
import { types as tt } from '../tokenizer/types'
import ExpressionParser from './expression'

export default class StatementParser extends ExpressionParser {
	parseTopLevel(program: N.Program): N.Program {
		this.nextToken()

		program.filename = this.options.filename
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
				return this.parseFunction(node, true)
			default:
				return this.parseExpressionStatement(node)
		}
	}

	parseImport(node: N.Import): N.Import {
		this.next()
		if (!this.match(tt.string)) this.unexpected('expected a string after import', false)
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

	parseFunction(node: N.FunctionDeclaration, topLevel: bool) {
		this.next()
		if (!this.match(tt.name)) {
			if (topLevel) {
				this.unexpected('need a name for func declaration')
			} else {
				const id: N.Identifier = this.startNode()
				id.name = 'Anonymous'
				node.id = this.finishNode(id, 'Identifier')
			}
		} else {
			node.id = this.parseIdentifier(this.startNode())
		}

		node.params = this.parseFunctionParams()
		node.body = this.parseExpressionBody(false)

		return this.finishNode(node, 'FunctionDeclaration')
	}

	parseFunctionParams(): N.ParameterDeclaration[] {
		const params = []

		this.expect(tt.parenL)
		while (!this.eat(tt.parenR)) {
			if (!this.match(tt.name)) this.unexpected()
			const node: N.ParameterDeclaration = this.startNode()

			node.id = this.parseIdentifier(this.startNode())
			if (this.eat(tt.colon)) {
				node.declType = this.parseIdentifier(this.startNode())
			} else {
				node.declType = null
			}

			params.push(this.finishNode(node, 'ParameterDeclaration'))
			if (!this.match(tt.parenR)) {
				this.expect(tt.comma)
			}
		}

		return params
	}
}
