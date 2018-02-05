// @flow
import type { Node } from '../types'
import {
	getFunctionScope,
	getItemFromScopes,
	type Scope,
} from './utils'
import {
	evaluateBinary,
	evaluateUnary,
} from './operators'

const evaluateCallExpression = (node, scopes) => {
	const name = node.callee.name
	const func = getItemFromScopes(scopes, name)
	const args = node.args.map(arg => evaluateNode(arg, scopes))

	if (func != null && func.type === 'FunctionDeclaration') {
		return evaluateNode(
			func.body,
			[getFunctionScope(func, args), ...scopes],
		)
	}
	if (typeof Math[name] === 'function') {
		return Math[name](...args)
	}

	throw new ReferenceError(`${name} is not a function`)
}

const evaluateIdentifier = (node, scopes) => {
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

export default function evaluateNode(node: Node, scopes: Scope[]) {
	switch (node.type) {
		case 'NumericLiteral':
			return node.value
		case 'BinaryExpression':
			return evaluateBinary(
				node.operator,
				evaluateNode(node.left, scopes),
				evaluateNode(node.right, scopes),
			)
		case 'UnaryExpression':
			return evaluateUnary(
				node.operator,
				evaluateNode(node.argument, scopes),
			)
		case 'Expression':
			return evaluateNode(node.body, scopes)
		case 'CallExpression':
			return evaluateCallExpression(node, scopes)
		case 'AbsParentheses':
			return Math.abs(evaluateNode(node.body, scopes))
		case 'Identifier':
			return evaluateIdentifier(node, scopes)
		default:
			return NaN
	}
}
