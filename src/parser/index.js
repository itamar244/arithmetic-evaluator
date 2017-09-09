// @flow
import type { Result } from '../types';
import State from './state'
import Statement from './statement'

export default class Parser extends Statement {
	constructor(input: string) {
		super()
		this.input = input
	}

	parse(): Result {
		this.state = new State(this.input)
		return this.parseTopLevel()
	}
}
