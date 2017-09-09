// @flow
import * as N from '../types'
import type { Token } from '../tokenizer'

export default class State {
	pos = 0
	prevToken: ?Token = null
	params: Set<string> = new Set()
	input: string
	isEquation: bool

	constructor(input: string) {
		this.input = input
	}
}
