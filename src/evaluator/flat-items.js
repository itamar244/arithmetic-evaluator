// @flow
import type { Tree } from '../parser'
import * as tt from '../parser/types'
import { evaluate } from './'
import { Node, ArgumentNode } from '../parser/node'
import { maxOperator } from './utils'
import { flat } from '../utils'


const reduceMatches = (tree) => {
	const firstNode = tree.find(item => item instanceof Node)
	const pureTree = []
	const notPureTree = []

	/* because the tree is ordered in operator, regular node,
	 * operator etc than skeeping one item each time is fine */
	for (let i = tree[0].type === tt.OPERATOR ? 1 : 0; i < tree.length; i += 2) {
		const part = tree[i]

		const isPure =
			// thanks to the fact the tree is reduced already, arrays must contain params
			!(part instanceof Array)
			&& !part.is(tt.PARAM)
			&& !(part instanceof ArgumentNode && part.hasParams());

		(isPure ? pureTree : notPureTree)
			.push(...tree.slice(i > 0 ? i - 1 : 0, i + 1))
	}

	// it won't give any benefit if the pure tree is shorter, only causing weird bugs
	if (pureTree.length < 2) {
		return tree
	}

	return (
		firstNode instanceof Node && !firstNode.is(tt.PARAM)
		? [new Node('NUMBER', evaluate(pureTree)), ...notPureTree]
		: [...notPureTree, pureTree[0], new Node(tt.NUMBER, evaluate(pureTree.slice(1)))]
	)
}

// makes the tree smaller, leaving only params not evaluated for faster evaluating after
const flatTree = (tree: Tree) => {
	const heighestOp = maxOperator(tree)
	let hasParam = false

	// be aware that this function has one side effect which is changing hasParam to true
	const newTree = tree.map((part) => {
		if (Array.isArray(part)) {
			const { tree: tmpTree, hasParam: innerrHasParams } = flatTree(part)

			if (!hasParam) hasParam = innerrHasParams

			if (innerrHasParams) {
				const innerHeighestOp = maxOperator(tmpTree)

				// if the brackets arent needed they will be removed
				return (
					!heighestOp
					|| innerHeighestOp
					&& heighestOp.getOrder() <= innerHeighestOp.getOrder()
						? tmpTree : [tmpTree]
				)
			}

			return [tmpTree[0]]
		}

		if (part.is(tt.PARAM)) {
			hasParam = true
		} else if (part instanceof ArgumentNode) {
			if (part.hasParams()) {
				if (!hasParam) hasParam = true

				return [new ArgumentNode(
					part.type,
					part.value,
					part.args.map(arg => flatTree(arg).tree),
				)]
			}
		}

		return [part]
	})

	return {
		tree: reduceMatches(flat(newTree)),
		hasParam,
	}
}

export default function flatEquation(equation: Tree[]) {
	return equation.map(e => flatTree(e).tree)
}
