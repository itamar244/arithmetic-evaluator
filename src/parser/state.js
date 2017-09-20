// @flow
import type { Node } from '../types';
import type { TokenType } from '../tokenizer/types'

export default class State {
	pos = 0
	lastTokenType: ?$PropertyType<Node, 'type'> = null
	curTokenType: TokenType
	params: Set<string> = new Set()
	input: string
	isEquation: bool

	constructor(input: string) {
		this.input = input
	}
}
