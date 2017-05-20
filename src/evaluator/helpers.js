// @flow
import type { Tree } from './../parser'
import * as tt from '../parser/types'
import { evaluate } from './'
import { orderPosition } from './../operators'
import { Node, ArgumentNode, OperatorNode }  from './../parser/node'
import { max } from '../utils'

const maxOperator = (tree) => {
	const res = max(
		tree,
		(max, node) => (
			!(max instanceof OperatorNode)
			|| (node instanceof OperatorNode
				&& node.getOrder() > max.getOrder())
		)
	)

	return res instanceof OperatorNode && res
}

const reduceMatches = (tree) => {
	const firstNode = tree.find(item => item instanceof Node)
	const pureTree = []
	const notPureTree = []

	for (let [i, part] of tree.entries()) {
		if (part.type !== tt.OPERATOR) {
			// thanks to the fact the tree is reduced already, arrays must contain params
			const isPure =
				!(part instanceof Array)
				&& !part.is(tt.PARAM)
				&& !(part instanceof ArgumentNode && part.hasParams);

			(isPure ?  pureTree : notPureTree)
				.push(...tree.slice(i > 0 ? i - 1 : 0, i + 1))
		}
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
export function flatTree(tree: Tree) {
	const heighestOp = maxOperator(tree)
	const newTree = []
	let hasParam = false

	for (let part of tree) {
		if (Array.isArray(part)) {
			const { tree: tmpTree, hasParam: innerrHasParams } = flatTree(part)

			if (!hasParam) hasParam = innerrHasParams

			if (innerrHasParams) {
				const innerHeighestOp = maxOperator(tmpTree)

				// if the brackets arent needed they will be removed
				if (
					!heighestOp
					|| innerHeighestOp
					&& orderPosition(heighestOp.value) >= orderPosition(innerHeighestOp.value)
				) {
					newTree.push(...tmpTree)
				} else {
					newTree.push(tmpTree)
				}
			} else {
				newTree.push(tmpTree[0])
			}

		} else {
			if (part.is(tt.PARAM)) {
				hasParam = true
			} else if (part instanceof ArgumentNode) {
				if (!hasParam) hasParam = part.hasParams

				if (hasParam) {
					// nextPart = part.set('args', part.args.map(arg => flatTree(arg).tree))
					part = new ArgumentNode(
						part.type,
						part.value,
						part.args.map(arg => flatTree(arg).tree)
					)
				}
			}

			newTree.push(part)
		}
	}

	return {
		tree: reduceMatches(newTree),
		hasParam,
	}
}
