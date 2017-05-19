// @flow
import type { Tree } from './../parser'
import { operators } from './../operators'
import { flatTree } from './helpers'
import { Node, ArgumentNode }  from './../parser/node'

const toFixed = precision => num => {
	if (!precision) {
		return Number(num)
	}
	const res = Math.floor(num * 10 ** precision) / 10 ** precision
	return Math.abs(res) === Infinity ? +num.toFixed(precision) : res
}

// using newton's binom for getting the correct value
export function evaluateEquation(
	equation: $ReadOnlyArray<Tree>,
	variableName: string,
	firstTime: bool = true,
) {
	// using mutable object here only for performance
	const params: { [key: string]: number } = { [variableName]: -1 }
	// pointing if need to add positive or negative values
	let dir
	let prevDir
	// the change to each try, growing or shrinking each time
	let change = 1/1.5
	// values for each side of equation
	let values: $ReadOnlyArray<number> = [0, 1]
	let tmpToFixed = toFixed()

	if (firstTime) {
		equation = equation.map(item => flatTree(item).tree)
	}

	// because NaN !== NaN the first run should work even if values is an empty array
	for (let i = 1; tmpToFixed(values[0]) !== tmpToFixed(values[1]); i++) {
		prevDir = dir || 1
		dir = values[0] < values[1] ? 1 : -1

		change *= dir === prevDir ? 1.5 : 1/4
		params[variableName] += dir * change
		values = equation.map(tree => evaluate(tree, params, false))

		// for irrational results for variableName the 20 digits precision wil cause infinte loop
		// so the precision gets smaller for too many loops
		if (i % 1000 === 0) tmpToFixed = toFixed(16 - (i / 1000|0))
		// if one of the values is Infinity than it will return
		if (values.some(n => Math.abs(n) === Infinity) && i > 100) {
			return (
				firstTime
				// if it the first time it wil reRun with a revers equation
				? evaluateEquation([...equation].reverse(), variableName, false)
				: 'no value' )
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

const next = (value, operator, cur) => (
	operator && operator.type === 'OPERATOR'
		? operators[operator.value][0](value, cur)
		: operators['*'][0](value || 1, cur) )


export const evaluate = (
	tree: Tree,
	params: { [key: string]: number } = {},
) => (
	tree
		.map(item => (
			Array.isArray(item)
				? new Node('NUMBER', String(evaluate(item, params)))
				: item
		))
		.reduce((value, node, i, tree) => {
			// saving temporarly the next function
			const tempNext = cur => next(value, tree[i-1], cur)

			return (
				node.is('PARAM')
				? tempNext(Number(params[node.value]))
				: node.is('NUMBER')
				? tempNext(Number(node.value))
				: node.is('CONSTANT')
				? tempNext(Math[node.value] || 0)
				: node instanceof ArgumentNode
				? tempNext( Math[node.value](...node.args.map(t => evaluate(t, params))) )
				: value /* default */
			)
		}, 0)
);
