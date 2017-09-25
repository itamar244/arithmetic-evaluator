// @flow
import type {
	Params,
	Node,
	VariableDeclerations,
	FunctionDeclaration,
} from '../types'
import evaluateNode from './eval';

export type Scope = Params

export const getFunctionDeclaration = (func: ?Node): ?FunctionDeclaration => (
	func != null && func.type === 'FunctionDeclaration'
	? func
	: null
)

export const variableDeclarationsToObject = (node: VariableDeclerations): Params => (
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
			`wrong number of arguments: '${func.id.name}`
			+ ` needed ${func.params.length}`
			+ `, intead of ${args.length}`,
		)
	}

	const scope = {}
	args.forEach((arg, i) => {
		scope[func.params[i].name] = arg
	})
	return evaluateNode(func.body, [scope].concat(scopes))
}
