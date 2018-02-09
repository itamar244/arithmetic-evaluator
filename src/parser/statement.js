// @flow
import { types as tt } from '../tokenizer/types'
import * as n from '../nodes'
import ExpressionParser from './expression'

export default class StatementParser extends ExpressionParser {
	parseTopLevel(): n.Program {
		this.nextToken()

		const filename = this.options.filename
		const body = []
		while (!this.match(tt.eof)) {
			body.push(this.parseStatement())
			this.semicolon()
		}
		return new n.Program(body, filename)
	}

	parseStatement() {
		switch (this.state.type) {
			case tt.import:
				return this.parseImport()
			case tt.let:
				return this.parseVariableDeclarations()
			case tt.func:
				return this.parseFunction()
			default:
				return this.parseExpressionStatement()
		}
	}

	parseImport(): n.Import {
		this.next()
		if (!this.match(tt.string)) this.unexpected('expected a string after import', false)
		const path = this.state.value
		this.next()

		return new n.Import(path)
	}

	parseExpressionStatement() {
		return new n.Expression(this.parseExpressionBody(true))
	}

	parseVariableDeclarations() {
		const declarations = []

		let end = false
		this.next()
		while (!end) {
			declarations.push(this.parseVarDeclarator())
			if (this.eat(tt.in)) {
				end = true
			} else {
				this.expect(tt.comma)
			}
		}
		return new n.VariableDeclerations(
			declarations,
			this.parseExpressionStatement(),
		)
	}

	parseVarDeclarator(): n.VariableDeclerator {
		if (!this.match(tt.name)) this.unexpected()
		const id = this.parseIdentifier()
		this.expect(tt.eq)

		return new n.VariableDeclerator(
			id,
			this.parseExpressionBody(false),
		)
	}

	parseFunction(): n.FunctionDeclaration {
		const params = []

		this.next()
		if (!this.match(tt.name)) this.unexpected('need a name for func declaration')
		const id = this.parseIdentifier()

		this.expect(tt.parenL)
		while (!this.eat(tt.parenR)) {
			if (!this.match(tt.name)) this.unexpected()
			params.push(this.parseIdentifier())
			if (!this.match(tt.parenR)) {
				this.expect(tt.comma)
			}
		}


		return new n.FunctionDeclaration(
			id,
			params,
			this.parseExpressionBody(false),
		)
	}
}
