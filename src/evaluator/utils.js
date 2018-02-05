// @flow
import type {
	Node,
	VariableDeclerations,
	FunctionDeclaration,
} from '../types'

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

export function getFunctionScope(
	func: FunctionDeclaration,
	args: number[],
) {
	if (func.params.length !== args.length) {
		throw RangeError(
			`wrong number of arguments: '${func.id.name}'`
			+ ` needed ${func.params.length}`
			+ `, intead of ${args.length}`,
		)
	}

	const scope = {}
	args.forEach((arg, i) => {
		scope[func.params[i].name] = arg
	})
	return scope
}
