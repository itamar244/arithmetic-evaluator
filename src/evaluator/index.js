// @flow
import * as tt from '../tokenizer/types'
import * as N from '../types'
import { operators } from '../operators'

const toFixed = precision => (num) => {
	if (!precision) {
		return Number(num)
	}
	const res = Math.floor(num * 10 ** precision) / 10 ** precision
	return Math.abs(res) === Infinity ? +num.toFixed(precision) : res
}

// using newton's binom for getting the correct value
export function evaluateEquation(
	startingEquation: N.Expression[],
	variableName: string,
	firstTime: bool = true,
) {
	// using mutable object here only for performance
	const params: { [key: string]: number } = { [variableName]: -1 }
	// pointing if need to add positive or negative values
	let dir
	let prevDir
	// the change to each try, growing or shrinking each time
	let change = 1 / 1.5
	// values for each side of equation
	let values: number[] = [0, 1]
	let tmpToFixed = toFixed()

	const equation = startingEquation

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
			return (
				firstTime
				// if it the first time it wil reRun with a revers equation
				? evaluateEquation([...equation].reverse(), variableName, false)
				: 'no value'
			)
		}
	}
	// there are some number anomalies at these ocations. the results supposed to be +-Infinity
	// they are the limits of save numbers in js, so they have their issues
	return (
		[26769460249232280, 21151178468529210, 2 ** 53].some(n => n === Math.abs(params[variableName]))
		? params[variableName] > 0 ? Infinity : -Infinity
		: params[variableName]
	)
}

export const evaluateExpression = (node: N.Node, params: { [string]: number }) => (
	node.type === 'EXPRESSION'
	? evaluateExpression(node.body, params)
	: node.type === tt.LITERAL
	?	node.value
	: node.type === tt.CONSTANT
	? Math[node.name]
	: node.type === tt.BIN_OPERATOR
	? operators[node.operator](
		node.left ? evaluateExpression(node.left, params) : 0,
		evaluateExpression(node.right, params),
	)
	: node.type === tt.FUNCTION
	? Math[node.name](...node.arguments.map(arg => evaluateExpression(arg, params)))
	: node.type === tt.PARAM
	? params[node.name]
	: 0
)
