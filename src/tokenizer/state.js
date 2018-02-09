// @flow
import { Position } from '../utils/location'
import { types as tt, type TokenType } from './types'

export default class State {
	pos: number
	line: number
	lineStart: number

	start: number
	end: number

	startLoc: Position
	endLoc: Position

	prevStart: number
	prevEnd: number
	prevStartLoc: Position
	prevEndLoc: Position

	type: TokenType

	prevSpacePadding: number
	value: any
	+input: string

	constructor(input: string) {
		const pos = new Position(0, 0)

		this.input = input
		this.pos = 0
		this.line = 0
		this.lineStart = 0
		this.start = 0
		this.end = 0
		this.startLoc = pos
		this.endLoc = pos
		this.prevStart = 0
		this.prevEnd = 0
		this.prevStartLoc = pos
		this.prevEndLoc = pos
		this.type = tt.eof
		this.prevSpacePadding = 0
	}

	position() {
		return new Position(this.line, this.pos - this.lineStart)
	}
}
