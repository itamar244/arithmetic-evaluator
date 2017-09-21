// @flow
import type { Node } from '../types'
import type { TokenType } from '../tokenizer/types'

export default class State {
	pos = 0
	start: number = 0
	end: number
	prevNode: ?Node = null
	prevType: ?TokenType = null
	type: TokenType
	prevSpacePadding: number = 0
	identifiers: Set<string> = new Set()
	value: any
	input: string

	constructor(input: string) {
		this.input = input
	}
}
