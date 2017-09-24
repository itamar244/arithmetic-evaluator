// @flow
import type { Node, Params } from '../types'
import { types as tt, type TokenType } from '../tokenizer/types'

export default class State {
	pos: number
	start: number
	end: number
	prevType: ?TokenType
	type: TokenType = tt.eof
	prevSpacePadding: number
	lookahead: bool
	identifiers: string[]
	value: any
	input: string

	init(input: string) {
		this.pos = 0
		this.start = 0
		this.end = 0
		this.prevType = null
		this.type = tt.eof
		this.prevSpacePadding = 0
		this.lookahead = false
		this.identifiers = []
		this.input = input
	}
}
