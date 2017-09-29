// @flow
import { types as tt, type TokenType } from '../tokenizer/types'
import Tokenizer from '../tokenizer'

export default class UtilParser extends Tokenizer {
	unexpected(_error?: string) {
		const error =	_error != null ? ` ${_error}` : ': unexpected token'
		const {
			start,
			value,
			type,
		} = this.state

		throw new SyntaxError(`${start} - '${value || type.label}'${error}`)
	}

	expect(type: TokenType): void {
		if (!this.eat(type)) this.unexpected()
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
