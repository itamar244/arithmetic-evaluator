// @flow
import { has } from '../utils'
import {
	types as tt,
	keywords,
	type TokenType,
} from './types'
import State from './state'

const isNumber = (code: number) => (code >= 48 && code <= 57)
const isLetter = (code: number) => (
	code >= 65 && code <= 90
	|| code >= 97 && code <= 122
)

export default class Tokenizer {
	// forward declarations:
	// parser/util.js
	+unexpected: (void | string) => void
	+state: State

	constructor(input: string) {
		this.state = new State(input)
	}

	next() {
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

	nextToken() {
		this.skipSpace()
		const { state } = this
		const code = state.input.charCodeAt(state.pos)

		state.start = state.pos
		state.startLoc = state.position()
		if (state.pos >= state.input.length) {
			this.finishToken(tt.eof)
		} else if (isNumber(code) || code === 46 /* . */) {
			this.readNumber()
		} else if (isLetter(code)) {
			this.readIdentifier()
		} else {
			this.getTokenFromCode(code)
		}
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
			case 123: // '{'
				return this.finishToken(tt.bracketL)
			case 125: // '}'
				return this.finishToken(tt.bracketR)
			case 59: // ';'
				return this.finishToken(tt.semi)
			case 34: // '"'
			case 39: // "'"
				return this.readString(code)
			default:
				this.finishWithValue(tt.error)
				throw this.unexpected()
		}
	}

	readNumber() {
		const { state } = this
		let hasDot = false

		for (;;) {
			const code = state.input.charCodeAt(state.pos)
			if (isNumber(code)) {
				this.state.pos += 1
			} else if (code === 46 /* '.' */ && !hasDot) {
				this.state.pos += 1
				hasDot = true
			} else {
				break
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

	readString(type: number) {
		const { state } = this
		let code = state.input.charCodeAt(state.pos)

		while (code !== type) {
			this.state.pos += 1
			code = state.input.charCodeAt(state.pos)
			if (code === 10 /* '\n' */ || state.pos >= state.input.length) {
				this.finishWithValue(tt.error)
				this.unexpected('unterminated string')
			}
		}
		state.pos += 1

		this.finishToken(tt.string, state.input.slice(state.start + 1, state.pos - 1))
	}

	skipSpace() {
		const { state } = this
		const startPos = state.pos
		let isSpaceCode = true

		while (isSpaceCode) {
			switch (state.input.charCodeAt(state.pos)) {
				case 32: // ' '
				case 9: // '\t'
					state.pos += 1
					break
				case 10: // '\n'
					state.pos += 1
					state.line += 1
					state.lineStart = state.pos
					break
				case 35: // '#'
					state.pos += 1
					this.skipLineComment()
					break
				default:
					isSpaceCode = false
			}
		}

		state.prevSpacePadding = state.pos - startPos
	}

	skipLineComment() {
		const { state } = this
		let code = state.input.charCodeAt(state.pos)

		while (code !== 10 /* '\n' */ && state.pos < state.input.length) {
			state.pos += 1
			code = state.input.charCodeAt(state.pos)
		}
	}

	finishWithValue(type: TokenType) {
		this.finishToken(
			type,
			this.state.input.slice(this.state.start, this.state.pos),
		)
	}

	finishToken(type: TokenType, value?: any) {
		this.state.value = value
		this.state.type = type
		this.state.end = this.state.pos
		this.state.endLoc = this.state.position()
	}
}
