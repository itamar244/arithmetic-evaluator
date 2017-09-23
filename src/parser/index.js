// @flow
import type { Result } from '../types'
import Statement from './statement'

export default class Parser extends Statement {
	input: string

	constructor(input: string) {
		super(input)
		this.input = input
	}

	parse(): Result {
		return this.parseTopLevel(this.startNode())
	}
}
