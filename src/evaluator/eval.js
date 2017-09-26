// @flow
import type { Node } from '../types'
import {
	getFunctionDeclaration,
	callFunction,
	getItemFromScopes,
	type Scope,
} from './utils'
import * as operators from './operator-functions'

export default function evaluateNode(node: Node, scopes: Scope[]) {
	switch (node.type) {
		case 'Literal':
			return node.value
		case 'BinaryExpression':
			return operators.BINARY[node.operator](
				evaluateNode(node.left, scopes),
				evaluateNode(node.right, scopes),
			)
		case 'UnaryExpression':
			return operators.UNARY[node.operator](evaluateNode(node.argument, scopes))
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

const evaluateCallExpression = (node, scopes) => {
	const name = node.callee.name
	const func = getFunctionDeclaration(getItemFromScopes(scopes, name))
	const args = node.args.map(arg => evaluateNode(arg, scopes))

	if (func == null && typeof Math[name] !== 'function') {
		throw new ReferenceError(`${name} is not a function`)
	}

	return (
		func
		? callFunction(func, args, scopes)
		: Math[name](...args)
	)
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
