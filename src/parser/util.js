// @flow
import { types as tt } from '../tokenizer/types'
import Tokenizer from '../tokenizer'
import State from './state'

export default class UtilParser extends Tokenizer {
	state: State

	raise(error: string, pos: number = this.state.start) {
		throw new Error(`${pos} - ${error}`)
	}

	expect(condition: bool): void {
		if (!condition) {
			this.raise(`${this.state.value || this.state.type.label}: unexpected token`)
		}
	}

	needMultiplierShortcut() {
		return (
			this.state.type.afterOp
			&& this.state.prevType != null && this.state.prevType.binop === null
		)
	}

	semicolon() {
		if (!this.eat(tt.semi) && !this.isLineTerminator()) this.raise('expected a line termintor')
	}

	isLineTerminator() {
		return (
			this.match(tt.semi)
			|| this.match(tt.eof)
			|| /\n/.test(this.state.input.slice(this.state.prevEnd, this.state.start))
		)
	}
}
