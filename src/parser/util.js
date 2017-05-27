// @flow
/* eslint-disable no-param-reassign */
import * as tt from '../tokenizer/types'
import Node from './node'
import * as N from '../types'

type Item = N.Node & Node

export default function pushItemToNode(node: Item, target: Item): Item {
	if (node.type === tt.BIN_OPERATOR) {
		if (
			target.type === tt.BIN_OPERATOR
			&& node.getOrder() > target.getOrder()
		) {
			target.right = pushItemToNode(node, target.right)
			return target
		}

		node.left = target
		return node
	}

	target.right = target.right	? pushItemToNode(node, target.right) : node
	return target
}
