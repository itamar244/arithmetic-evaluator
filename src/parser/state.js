// @flow
import type { Node } from '../types'
import type { TokenType } from '../tokenizer/types'

export default class State {
	pos: number
	start: number
	end: number
	prevNode: ?Node
	prevType: ?TokenType
	type: TokenType
	prevSpacePadding: number
	identifiers: Set<string>
	value: any
	input: string

	init(input: string) {
		this.pos = 0
		this.start = 0
		this.end = 0
		this.prevNode = null
		this.prevType = null
		this.prevSpacePadding = 0
		this.identifiers = new Set()
		this.input = input
	}
}
