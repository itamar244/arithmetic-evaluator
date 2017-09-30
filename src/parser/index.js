// @flow
import { type Options } from '../options';
import StatementParser from './statement'

export default class Parser extends StatementParser {
	constructor(input: string, options: Options) {
		super(input)
		this.options = options
	}

	parse() {
		return this.parseTopLevel(this.startNode())
	}

	getStatement() {
		this.nextToken()
		return this.parseStatement()
	}
}
