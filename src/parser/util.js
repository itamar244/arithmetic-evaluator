// @flow
import { types as tt, type TokenType } from '../tokenizer/types'
import type { Options } from '../options'
import Tokenizer from '../tokenizer'

export default class UtilParser extends Tokenizer {
	options: Options

	unexpected(_error?: string, showValue: bool = true) {
		const error =	_error || ': unexpected token'
		const { filename } = this.options
		const {
			start,
			value,
			type,
		} = this.state
		const prefix = showValue ? `'${value || type.label}'` : ''
		const padding = showValue && _error != null ? ' ' : ''

		throw new SyntaxError(`${filename}: ${start} - ${prefix}${padding}${error}`)
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
