// @flow
import Utils from '../utils/common-class'
import State from '../parser/state'
import { OPERATOR_CODES } from '../operators'
import * as tt from './types'

const isNumber = (code: number) => code >= 48 && code <= 57
const isLetter = (code: number) => (
	code >= 65 && code <= 90
	|| code >= 97 && code <= 122
)

export type Token = tt.Token

export default class Tokenizer extends Utils {
	state: State

	constructor(state: State) {
		super()
		this.state = state
	}

	next(): void {
		this.skipSpace()
		const { state } = this
		const code = state.input.charCodeAt(state.pos)

		state.start = state.pos
		if (state.pos >= state.input.length) {
			return this.finishToken(tt.EOF)
		}
		if (isNumber(code) || code === 46 /* . */) {
			return this.readNumber()
		}
		if (isLetter(code)) {
			return this.readIdentifier()
		}
		// one long tokens
		state.pos += 1
		if (OPERATOR_CODES.includes(code)) {
			return this.finishToken(tt.OPERATOR, String.fromCharCode(code))
		}
		switch (code) {
			case 44: // ','
				return this.finishToken(tt.COMMA)
			case 40: // '('
				return this.finishToken(tt.PAREN_L)
			case 41: // ')'
				return this.finishToken(tt.PAREN_R)
			case 124: // '|'
				return this.finishToken(tt.CROTCHET)
			default:
				return this.finishToken(tt.ERROR, String.fromCharCode(code))
		}
	}

	readNumber() {
		const { state } = this
		let toBreak = false
		let hasDot = false

		while (!toBreak) {
			const code = state.input.charCodeAt(state.pos)
			if (isNumber(code)) {
				this.state.pos += 1
			} else if (code === 46 /* '.' */ && !hasDot) {
				this.state.pos += 1
				hasDot = true
			} else {
				toBreak = true
			}
		}

		this.finishToken(tt.LITERAL, state.input.slice(state.start, state.pos))
	}

	readIdentifier() {
		const { state } = this
		while (isLetter(state.input.charCodeAt(state.pos))) {
			state.pos += 1
		}

		this.finishToken(tt.IDENTIFIER, state.input.slice(state.start, state.pos))
	}

	skipSpace() {
		const { state } = this
		let toBreak = false

		state.prevSpacePadding = 0
		while (!toBreak && state.pos < state.input.length) {
			if (state.input.charCodeAt(state.pos) === 32 /* ' ' */) {
				state.prevSpacePadding += 1
			} else {
				toBreak = true
			}
		}
		state.pos += state.prevSpacePadding
	}

	finishToken(type: tt.TokenType, value?: any) {
		this.state.value = value
		this.state.prevType = this.state.type
		this.state.type = type
		this.state.end = this.state.pos
	}
}
