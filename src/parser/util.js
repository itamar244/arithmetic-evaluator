// @flow
import { types as tt, type TokenType } from '../tokenizer/types'
import Tokenizer from '../tokenizer'

export default class UtilParser extends Tokenizer {
	raise(error: string, pos: number = this.state.start) {
		throw new Error(`${pos} - ${error}`)
	}

	unexpected() {
		this.raise(`'${this.state.value || this.state.type.label}': unexpected token`)
	}

	expect(type: TokenType): void {
		if (!this.match(type)) {
			this.unexpected()
		}
	}

	needMultiplierShortcut() {
		return (
			this.state.type.afterOp
			&& this.state.prevType != null && this.state.prevType.binop === null
		)
	}

	semicolon() {
		if (!this.eat(tt.semi) && !this.isLineTerminator()) this.unexpected()
	}

	isLineTerminator() {
		return (
			this.match(tt.semi)
			|| this.match(tt.eof)
			|| /\n/.test(this.state.input.slice(this.state.prevEnd, this.state.start))
		)
	}
}
