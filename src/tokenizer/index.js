// @flow
import Utils from '../utils/common-class'
import State from '../parser/state'
import { OPERATORS } from '../operators'
import * as tt from './types'

const OPERATOR_CODES = OPERATORS.map(operator => operator.charCodeAt(0))
const isNumber = (code: number) => code >= 48 && code <= 57
const isLetter = (code: number) => (
	code >= 65 && code <= 90
	|| code >= 97 && code <= 122
)

export default class Tokenizer extends Utils {
	state: State

	constructor(input: string) {
		super()
		this.state = new State()
		this.state.init(input)
	}

	next() {
		this.skipSpace()
		const code = this.state.input.charCodeAt(this.state.pos)

		this.state.start = this.state.pos
		if (this.state.pos >= this.state.input.length) {
			return this.finishToken(tt.EOF)
		}
		if (isNumber(code) || code === 46 /* . */) {
			return this.readNumber()
		}
		if (isLetter(code)) {
			return this.readIdentifier()
		}
		// one long tokens
		this.state.pos += 1
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
				state.pos += 1
			} else {
				toBreak = true
			}
		}
	}

	finishToken(type: tt.TokenType, value?: any) {
		this.state.value = value
		this.state.prevType = this.state.type
		this.state.type = type
		this.state.end = this.state.pos
	}
}
