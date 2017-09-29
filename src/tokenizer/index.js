// @flow
import { has } from '../utils'
import { types as tt, keywords, type TokenType } from './types'
import State from './state'

const isNumber = (code: number) => code >= 48 && code <= 57
const isLetter = (code: number) => (
	code >= 65 && code <= 90
	|| code >= 97 && code <= 122
)

export default class Tokenizer {
	// forward declarations:
	// parser/util.js
	+unexpected: () => void
	state: State = new State()

	expectNext(type: TokenType) {
		this.next()
		if (!this.match(type)) this.unexpected()
	}

	next(): void {
		this.state.prevStart = this.state.start
		this.state.prevEnd = this.state.end
		this.state.prevStartLoc = this.state.startLoc
		this.state.prevEndLoc = this.state.endLoc
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
		this.state.startLoc = this.state.position()
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
				return this.finishToken(tt.plus, '+')
			case 45: // '-'
				return this.finishToken(tt.minus, '-')
			case 42: // '*'
				return this.finishToken(tt.star, '*')
			case 47: // '/'
				return this.finishToken(tt.slash, '/')
			case 37: // '%'
				return this.finishToken(tt.modulo, '%')
			case 94: // '^'
				return this.finishToken(tt.exponent, '^')
			case 33: // '!'
				return this.finishToken(tt.bang, '!')
			case 61: // '='
				return this.finishToken(tt.eq, '=')
			case 44: // ','
				return this.finishToken(tt.comma)
			case 40: // '('
				return this.finishToken(tt.parenL)
			case 41: // ')'
				return this.finishToken(tt.parenR)
			case 124: // '|'
				return this.finishToken(tt.crotchet)
			case 59: // ';'
				return this.finishToken(tt.semi)
			default:
				this.finishWithValue(tt.error)
				return this.unexpected()
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

		this.finishWithValue(tt.num)
	}

	readIdentifier() {
		const { state } = this
		while (isLetter(state.input.charCodeAt(state.pos))) {
			state.pos += 1
		}

		const word = state.input.slice(state.start, state.pos)
		if (has(keywords, word)) {
			this.finishToken(keywords[word], word)
		} else {
			this.finishToken(tt.name, word)
		}
	}

	skipSpace() {
		const { state } = this
		let cur = state.input.charCodeAt(state.pos)
		let padding = 0

		while (cur === 32 /* ' ' */ || cur === 10 /* '\n' */ || cur === 9 /* '\t' */) {
			padding += 1
			if (cur === 10 /* '\n' */) {
				this.state.line += 1
				this.state.lineStart = this.state.pos + padding
			}
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
		this.state.prevType = this.state.type

		this.state.value = value
		this.state.type = type
		this.state.end = this.state.pos
		this.state.endLoc = this.state.position()
	}
}
