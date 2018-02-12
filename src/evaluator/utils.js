// @flow
import type {
	Node,
	VariableDeclerations,
	FunctionDeclaration,
} from '../types'
import type { EvalValue } from './values'

export type Scope = { [string]: ?Node }

export const variableDeclarationsToObject = (node: VariableDeclerations): Scope => (
	node.declarations.reduce((scope, declaration) => {
		scope[declaration.id.name] = declaration.init
		return scope
	}, {})
)

export function getItemFromScopes(scopes: Scope[], name: string) {
	for (const scope of scopes) {
		if (scope[name] !== undefined) {
			return scope[name]
		}
	}
	return null
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
	validateArgs(func.id.name, func.params.length, args.length, false)

	const scope = {}
	args.forEach((arg, i) => {
		scope[func.params[i].name] = arg
	})
	return scope
}
