// @flow
import { CONST_LITERALS } from './runtime-values'
import type { EvalValue } from './values'

export type Scope = Map<string, EvalValue>

export function getItemFromScopes(
	scopes: Scope[],
	name: string,
): EvalValue {
	for (const scope of scopes) {
		const value = scope.get(name)
		if (value !== undefined) {
			return value
		}
	}
	return CONST_LITERALS.null
}
