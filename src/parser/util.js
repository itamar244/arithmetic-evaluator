// @flow
/* eslint-disable no-param-reassign */
import * as N from '../types'
import * as tt from '../tokenizer/types'
import typeof Node from './node'

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
