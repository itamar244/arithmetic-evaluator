// @flow
import type {
	Node,
	VariableDeclerations,
	FunctionDeclaration,
} from '../types'
import evaluateNode from './eval'

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

export function callFunction(
	func: FunctionDeclaration,
	args: number[],
	scopes: Scope[],
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
	return evaluateNode(func.body, [scope, ...scopes])
}
