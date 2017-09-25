// @flow
import * as N from '../types'
import {
	BIN_OPERATORS_METHODS,
	UNARY_OPERATORS_METHODS,
} from './operator-functions'

// there are some number anomalies at these ocations. the results supposed to be +-Infinity
// they are the limits of safe numbers in js, so they have their issues
const ANOMALY_NUMBERS = [
	26769460249232280,
	21151178468529210,
	2 ** 53,
]

const toFixed = precision => (num) => {
	const res = Math.floor(num * (10 ** precision)) / (10 ** precision)
	return Math.abs(res) === Infinity ? +num.toFixed(precision) : res
}

// using newton's binom algroithm for getting the correct value
export function evaluateEquation(
	node: N.Equation,
	variableName: string,
	reversed: bool = false,
) {
	const equation = reversed ? [node.right, node.left] : [node.left, node.right]
	// using mutable object here only for performance
	const params: { [key: string]: number } = { [variableName]: -1 }
	// pointing if need to add positive or negative values
	let dir
	let prevDir
	// the change to each try, growing or shrinking each time
	let change = 1 / 1.5
	// values for each side of equation
	let values: number[] = [0, 1]
	// the number decreases for each 1000's loop
	let tmpToFixed = number => number

	// because NaN !== NaN the first run should work even if values is an empty array
	for (let i = 1; tmpToFixed(values[0]) !== tmpToFixed(values[1]); i += 1) {
		prevDir = dir || 1
		dir = values[0] < values[1] ? 1 : -1

		change *= dir === prevDir ? 1.5 : 1 / 4
		params[variableName] += dir * change
		values = equation.map(tree => evaluateExpression(tree, params))

		/* for irrational results for variableName the 20 digits precision wil cause infinte loop
		 * so the precision gets smaller for too many loops */
		if (i % 1000 === 0) tmpToFixed = toFixed(16 - (Math.floor(i / 1000)))
		// if one of the values is Infinity than it will return
		if (values.some(n => Math.abs(n) === Infinity) && i > 100) {
			// if it the first time it wil re run with a revers equation
			return !reversed ? evaluateEquation(node, variableName, true) : NaN
		}
	}

	return (
		ANOMALY_NUMBERS.some(n => n === Math.abs(params[variableName]))
		? Infinity * (params[variableName] > 0 ? 1 : -1)
		: params[variableName]
	)
}

export function getVariablesFromNode(node: N.Node): N.Params {
	if (node.type !== 'VariableDeclerations') return {}

	return node.declarations.reduce((params, declaration) => {
		params[declaration.id.name] = declaration.init
		return params
	}, {})
}

export function evaluateExpression(
	node: N.Node,
	params: N.Params | { [string]: number } = {},
) {
	switch (node.type) {
		case 'Literal':
			return node.value
		case 'BinaryOperator':
			return BIN_OPERATORS_METHODS[node.operator](
				evaluateExpression(node.left, params),
				evaluateExpression(node.right, params),
			)
		case 'UnaryOperator':
			return UNARY_OPERATORS_METHODS[node.operator](evaluateExpression(node.argument))
		case 'Expression':
			return (node.body ? evaluateExpression(node.body, params) : 0)
		case 'Function':
			return Math[node.callee.name](...node.args.map(arg => evaluateExpression(arg, params)))
		case 'AbsParentheses':
			return Math.abs(evaluateExpression(node.body, params))
		case 'Identifier': {
			const inParams = node.name in params
			if (!inParams && typeof Math[node.name] !== 'number') {
				throw new ReferenceError(`${node.name} is undefined`)
			}
			return (
				!inParams
				? Math[node.name]
				: typeof params[node.name] === 'number'
				? params[node.name]
				: evaluateExpression(params[node.name])
			)
		}
		case 'VariableDeclerations':
			return evaluateExpression(node.expression, params)
		default:
			return NaN
	}
}
