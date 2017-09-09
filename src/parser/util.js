// @flow
/* eslint-disable no-param-reassign */
import * as N from '../types'
import * as tt from '../tokenizer/types'
import { orderPosition } from '../operators'

function mergeBinary(nextNode, target) {
	if (
		target.type === tt.BIN_OPERATOR
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
	if (nextNode.type === tt.UNARY_OPERATOR) {
		// new node is a postfixed unary operator
		nextNode.argument = target
		returnedNode = nextNode
	} else if (target.type === tt.UNARY_OPERATOR && !target.argument) {
		// old node is an empty prefixed unary operator
		target.argument = nextNode
	} else if (nextNode.type === tt.BIN_OPERATOR) {
		// new node is a binary operator
		returnedNode = mergeBinary(nextNode, target)
	} else if (target.type === tt.BIN_OPERATOR) {
		// old node is binary operator followed by literal
		// NOTE: important to recursively merge nodes for incremently order of binary operators
		target.right = target.right	? mergeNodes(nextNode, target.right) : nextNode
	}

	return returnedNode
}
