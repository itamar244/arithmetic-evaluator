// @flow
import type {	FunctionDeclaration } from '../types'
import { CONST_LITERALS } from './runtime-values'
import type { EvalValue } from './values'

export type Scope = Map<string, EvalValue>

export function getItemFromScopes(
	scopes: Scope[],
	name: string,
): EvalValue {
	for (const scope of scopes) {
		const value = scope.get(name);
		if (value != null) {
			return value
		}
	}
	return CONST_LITERALS.null
}

export function validateArgs(
	name: string,
	funcParams: number,
	providedArgs: number,
	allowInfinite: bool,
) {
	if (funcParams !== providedArgs && (!allowInfinite || funcParams > 0)) {
		throw RangeError(
			`wrong number of arguments: '${name}'`
			+ ` needed ${funcParams}`
			+ `, intead of ${providedArgs}`,
		)
	}
}


export function getFunctionScope(
	func: FunctionDeclaration,
	args: EvalValue[],
): Scope {
	const scope = new Map()

	validateArgs(func.id.name, func.params.length, args.length, false)

	for (let i = 0; i < args.length; i += 1) {
		const { id, declType } = func.params[i]
		if (
			declType !== null
			&& declType.name !== 'any' && declType.name !== args[i].type
		) {
			throw TypeError(`expected ${declType.name} for ${id.name}, not ${args[i].type}`)
		}
		scope.set(param.id.name, args[i])
	}

	return scope
}
