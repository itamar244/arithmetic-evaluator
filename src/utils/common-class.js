// @flow
import type State from '../parser/state'

export default class Util {
	state: State

	raise(error: string, pos: number = this.state.start) {
		throw new Error(`${pos} - ${error}`)
	}

	raiseIfTruthy(error: null | string | false) {
		if (error) this.raise(error)
	}

	expected(expect: bool): void {
		if (!expect) {
			this.raise(`${this.state.value || this.state.type.label}: unexpected token`)
		}
	}
}
