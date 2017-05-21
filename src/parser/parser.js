// @flow
import Statement from './statement'

export default class Parser {
	file: string
	parts: string[]
	statements: Statement[] = []
	hasError: bool = false
	params: Set<string> = new Set()

	constructor(file: string) {
		this.parts = file.split('=')

		this.statements = this.parts.map(part => new Statement(part, this.params))
		this.hasError = this.statements.some(statement => statement.tree.hasError)
	}
}
