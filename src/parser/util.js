// @flow
import Tokenizer from '../tokenizer'
import State from './state'


export default class UtilParser extends Tokenizer {
	state: State

	raise(error: string, pos: number = this.state.start) {
		throw new Error(`${pos} - ${error}`)
	}

	raiseIfTruthy(error: null | string | false) {
		if (error) this.raise(error)
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
}
