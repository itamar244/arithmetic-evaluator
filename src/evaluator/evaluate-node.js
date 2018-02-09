// @flow
import * as n from '../nodes'
import * as customFunctions from './functions'
import {
	getFunctionScope,
	getItemFromScopes,
	type Scope,
} from './utils'
import {
	binaryOperator,
	unaryOperator,
} from './operators'

function evaluateCallExpression(node: n.CallExpression, scopes: Scope[]) {
	const name = node.callee.name
	const func = getItemFromScopes(scopes, name)
	const args = node.args.map(arg => evaluateNode(arg, scopes))

	if (func != null && func.type === 'FunctionDeclaration') {
		return evaluateNode(
			func.body,
			[getFunctionScope(func, args), ...scopes],
		)
	}

	const builtin = Math[name] || customFunctions[name]
	if (typeof builtin === 'function') {
		return builtin(...args)
	}

	throw new ReferenceError(`${name} is not a function`)
}

function evaluateIdentifier(node: n.Identifier, scopes: Scope[]) {
	const item = getItemFromScopes(scopes, node.name)

	if (item == null && typeof Math[node.name] !== 'number') {
		throw new ReferenceError(`${node.name} is undefined`)
	}
	return (
		item == null
		? Math[node.name]
		: typeof item === 'number'
		? item
		: evaluateNode(item, scopes)
	)
}

export default function evaluateNode(
	node: n.Node,
	scopes: Scope[],
): number {
	switch (node.type) {
		case 'NumericLiteral':
			return node.value
		case 'BinaryExpression':
			return binaryOperator(
				node.operator,
				evaluateNode(node.left, scopes),
				evaluateNode(node.right, scopes),
			)
		case 'UnaryExpression':
			return unaryOperator(
				node.operator,
				evaluateNode(node.argument, scopes),
			)
		case 'Expression':
			return node.isAbs
				? Math.abs(evaluateNode(node.body, scopes))
				: evaluateNode(node.body, scopes)
		case 'CallExpression':
			return evaluateCallExpression(node, scopes)
		case 'Identifier':
			return evaluateIdentifier(node, scopes)
		default:
			return NaN
	}
}
