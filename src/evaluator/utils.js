// @flow
import { max } from '../utils'
import type { Tree, TreeItem } from './../parser'
import { Node, OperatorNode } from './../parser/node'


export const maxOperator = (tree: Tree) => {
	const res = max(
		tree,
		(prev, node) => (
			!(prev instanceof OperatorNode)
			|| (node instanceof OperatorNode
				&& node.getOrder() > prev.getOrder())
		),
	)

	return res instanceof OperatorNode && res
}

const isSameTrees = (a: Tree, b: Tree) => (
	a.every((item, i) => b[i] && isSameTreeItem(item, b[i]))
)

export const isSameTreeItem = (a: TreeItem, b: TreeItem) => (
	a instanceof Node
	// ? a.equals(b) - add equals function
	? a === b
	: Array.isArray(b) && isSameTrees(a, b)
)
