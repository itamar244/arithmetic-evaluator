// @flow
import type { Result } from '../types'
import State from './state'
import Tokenizer from '../tokenizer'
import Statement from './statement'

export default class Parser extends Statement {
	input: string

	constructor(input: string) {
		super()
		this.input = input
	}

	parse(): Result {
		this.state = new State(this.input)
		this.tokenizer = new Tokenizer(this.state)

		return this.parseTopLevel(this.startNode())
	}
}
