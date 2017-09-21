// @flow
import State from '../parser/state'

export default class Util {
	state: State

	raise(error: string, pos: number = this.state.pos) {
		throw new Error(`${pos} - ${error}`)
	}

	raiseIfTruthy(error: null | string | false) {
		if (error) this.raise(error)
	}
}
