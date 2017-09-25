// @flow
import State from '../parser/state'
import { has } from '../utils'
import { types as tt, keywords as kt, TokenType } from '../tokenizer/types'

const isNumber = (code: number) => code >= 48 && code <= 57
const isLetter = (code: number) => (
	code >= 65 && code <= 90
	|| code >= 97 && code <= 122
)

export default class Tokenizer {
	// forward declarations: parser/util.js
	+expect: (condition: bool) => void
	state: State

	constructor() {
		this.state = new State()
	}

	expectNext(type: TokenType) {
		this.next()
		this.expect(this.match(type))
	}

	lookaheadFor(type: TokenType | (TokenType) => bool) {
		this.lookahead()

		if (typeof type === 'function' ? type(this.state.type) : (this.state.type === type)) {
			this.state.lookahead = false
			return true
		}
		return false
	}

	// getting the next item, but if next is called again then it will the lookahead
	// NOTE: use with caution, it will affect state to next token
	lookahead() {
		if (!this.state.lookahead) {
			this.next()
			this.state.lookahead = true
		}
	}

	next(): void {
		if (this.state.lookahead) {
			this.state.lookahead = false
			return
		}
		this.nextToken()
	}

	match(type: TokenType) {
		return this.state.type === type
	}

	eat(type: TokenType) {
		if (this.match(type)) {
			this.next()
			return true
		}
		return false
	}

	nextToken(): void {
		this.skipSpace()
		const code = this.state.input.charCodeAt(this.state.pos)

		this.state.start = this.state.pos
		if (this.state.pos >= this.state.input.length) {
			return this.finishToken(tt.eof)
		}
		if (isNumber(code) || code === 46 /* . */) {
			return this.readNumber()
		}
		if (isLetter(code)) {
			return this.readIdentifier()
		}
		return this.getTokenFromCode(code)
	}

	getTokenFromCode(code: number): void {
		this.state.pos += 1

		switch (code) {
			case 43: // '+'
			case 45: // '-'
				return this.finishWithValue(tt.plusMin)
			case 42: // '*'
				return this.finishWithValue(tt.star)
			case 47: // '/'
				return this.finishWithValue(tt.slash)
			case 37: // '%'
				return this.finishWithValue(tt.modulo)
			case 94: // '^'
				return this.finishWithValue(tt.exponent)
			case 33: // '!'
				return this.finishWithValue(tt.bang)
			case 61: // '='
				return this.finishToken(tt.eq)
			case 44: // ','
				return this.finishToken(tt.comma)
			case 40: // '('
				return this.finishToken(tt.parenL)
			case 41: // ')'
				return this.finishToken(tt.parenR)
			case 124: // '|'
				return this.finishToken(tt.crotchet)
			default:
				this.finishWithValue(tt.error)
				return this.expect(false)
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

		this.finishWithValue(tt.literal)
	}

	readIdentifier() {
		const { state } = this
		while (isLetter(state.input.charCodeAt(state.pos))) {
			state.pos += 1
		}

		const word = state.input.slice(state.start, state.pos)
		if (has(kt, word)) {
			this.finishToken(kt[word], word)
		} else {
			this.finishToken(tt.identifier, word)
		}
	}

	skipSpace() {
		const { state } = this
		let cur = state.input.charCodeAt(state.pos)
		let padding = 0

		while (cur === 32 /* ' ' */) {
			padding += 1
			cur = state.input.charCodeAt(state.pos + padding)
		}
		state.prevSpacePadding = padding
		state.pos += padding
	}

	finishWithValue(type: TokenType) {
		this.finishToken(
			type,
			this.state.input.slice(this.state.start, this.state.pos),
		)
	}

	finishToken(type: TokenType, value?: any) {
		this.state.value = value
		this.state.prevType = this.state.type
		this.state.type = type
		this.state.end = this.state.pos
	}
}
