// @flow
import StatementParser from './statement'

export default class Parser extends StatementParser {
	parse(input: string) {
		this.state.init(input)
		return this.parseTopLevel(this.startNode())
	}
}
