// @flow
import * as N from '../types'
import { orderPosition } from '../operators'

const precendence = (node: N.BinOperator): number => (
	// eslint-disable-next-line no-underscore-dangle
	node.__prec !== undefined ? node.__prec : (node.__prec = orderPosition(node.operator))
)

/** merge two continous nodes into one */
export default function mergeNodes(nextNode: N.Node, target: ?N.Node): N.Node {
	if (!target) return nextNode

	if (nextNode.type === 'UnaryOperator') {
		// new node is a postfixed unary operator
		nextNode.argument = target
		return nextNode
	}
	if (nextNode.type === 'BinaryOperator') {
		// new node is a binary operator
		if (
			target.type === 'BinaryOperator'
			&& precendence(nextNode) > precendence(target)
		) {
			target.right = mergeNodes(nextNode, target.right)
			return target
		}

		nextNode.left = target
		return nextNode
	}

	return target
}
