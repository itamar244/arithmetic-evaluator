// @flow
import type { Node } from '../types'
import { types as tt } from '../tokenizer/types'
import State from './state'

export const needMultiplierShortcut = (state: State) => (
	state.type.afterOp
	&& state.prevType != null && state.prevType.binop === null
)
