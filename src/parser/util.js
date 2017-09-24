// @flow
import type { Node } from '../types'
import { types as tt } from '../tokenizer/types'
import State from './state'

export const needMultiplierShortcut = (state: State, prevNode: ?Node) => (
	state.type.binop === null
	&& prevNode != null && state.prevType && state.prevType.binop === null
	&& (state.type === tt.identifier || state.type === tt.parenL)
)
