// @flow
import * as N from '../types'
import { orderPosition } from '../operators'

const deepestRightBinaryNode = (node: N.BinOperator): N.BinOperator => (
	node.right != null && node.right.type === 'BinaryOperator'
	? deepestRightBinaryNode(node.right)
	: node
)

const getOrder = (node: N.BinOperator): number => (
	// eslint-disable-next-line no-underscore-dangle
	node.__prec !== undefined ? node.__prec : (node.__prec = orderPosition(node.operator))
)

function mergeBinary(nextNode, target) {
	if (
		target.type === 'BinaryOperator'
		&& getOrder(nextNode) > getOrder(target)
	) {
		target.right = mergeNodes(nextNode, target.right)
		return target
	}

	nextNode.left = target
	return nextNode
}

/** merge two continous nodes into one */
export default function mergeNodes(nextNode: N.Node, target: ?N.Node): N.Node {
	if (!target) return nextNode

	let returnedNode = target
	if (nextNode.type === 'UnaryOperator') {
		// new node is a postfixed unary operator
		nextNode.argument = target
		returnedNode = nextNode
	} else if (target.type === 'UnaryOperator' && !target.argument) {
		// old node is an empty prefixed unary operator
		target.argument = nextNode
	} else if (nextNode.type === 'BinaryOperator') {
		// new node is a binary operator
		returnedNode = mergeBinary(nextNode, target)
	} else if (target.type === 'BinaryOperator') {
		// old node is binary operator followed by literal
		const deepRight = deepestRightBinaryNode(target)
		deepRight.right = mergeNodes(nextNode, deepRight.right)
	} else if (target.type === 'Identifier' && nextNode.type === 'Function') {
		// old node is identifier and new node is function call
		nextNode.callee = target
		returnedNode = nextNode
	}

	return returnedNode
}
