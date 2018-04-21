// @flow
import type { Node } from '../types'
import {
	CONST_LITERALS,
	RUNTIME_FUNCTIONS,
} from './runtime-values'
import {
	getFunctionScope,
	getItemFromScopes,
	validateArgs,
	type Scope,
} from './utils'
import {
	binaryOperator,
	unaryOperator,
} from './operators'
import {
	EvalFunction,
	EvalNumber,
	EvalVector,
	type EvalValue,
} from './values'

function evaluateVector(vector, scopes) {
	const x = evaluateNode(vector.x, scopes)
	const y = evaluateNode(vector.y, scopes)

	if (x.type !== 'Number' || y.type !== 'Number') {
		throw Error("vector's coordinates must be numbers")
	}
	return new EvalVector(x, y)
}

function evaluateCallExpression(node, scopes) {
	const { name } = node.callee
	const item = getItemFromScopes(scopes, name)
	const args = node.args.map(arg => evaluateNode(arg, scopes))

	if (item.type === 'Function') {
		return evaluateNode(
			item.value.body,
			[getFunctionScope(item.value, node.typeArgs, args), ...scopes],
		)
	}

	const runtimeFunc = RUNTIME_FUNCTIONS[name]
	if (typeof runtimeFunc === 'function') {
		validateArgs(name, runtimeFunc.length, args.length, true)
		return runtimeFunc(...args)
	} else if (typeof Math[name] === 'function') {
		return new EvalNumber(Math[name](...args.map((arg) => {
			if (arg.type !== 'Number') {
				throw TypeError(`native ${name} function expects only numbers as arguments`)
			}
			return arg.value
		})))
	}

	throw new ReferenceError(`${name} is not a function`)
}

function evaluateIdentifier(node, scopes) {
	const item = getItemFromScopes(scopes, node.name)

	if (item === CONST_LITERALS.null && typeof Math[node.name] !== 'number') {
		throw new ReferenceError(`${node.name} is undefined`)
	}

	return item === CONST_LITERALS.null
		? new EvalNumber(Math[node.name]) : item
}

export default function evaluateNode(node: Node, scopes: Scope[]): EvalValue {
	switch (node.type) {
		case 'NumericLiteral':
			return new EvalNumber(node.value)
		case 'ConstLiteral':
			return CONST_LITERALS[node.name]
		case 'VectorExpression':
			return evaluateVector(node, scopes)
		case 'FunctionDeclaration':
			return new EvalFunction(node)
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
			return evaluateNode(node.body, scopes)
		case 'Parenthesized': {
			const value = evaluateNode(node.body, scopes)
			return node.abs ? value.abs() : value
		}
		case 'CallExpression':
			return evaluateCallExpression(node, scopes)
		case 'Identifier':
			return evaluateIdentifier(node, scopes)
		default:
			return new EvalNumber(NaN)
	}
}
