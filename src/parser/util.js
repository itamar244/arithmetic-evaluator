// @flow
import * as N from '../types'
import { orderPosition } from '../operators'

function mergeBinary(nextNode, target) {
	if (
		target.type === 'BinaryOperator'
		&& orderPosition(nextNode.operator) > orderPosition(target.operator)
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
		// NOTE: important to recursively merge nodes for incremently order of binary operators
		target.right = target.right	? mergeNodes(nextNode, target.right) : nextNode
	}

	return returnedNode
}
