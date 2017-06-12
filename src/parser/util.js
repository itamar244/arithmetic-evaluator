// @flow
/* eslint-disable no-param-reassign */
import * as N from '../types'
import * as tt from '../tokenizer/types'
import { getNodeOrder } from './node'

export default function pushItemToNode(node: N.Node, target: ?N.Node): N.Node {
	if (!target) return node

	if (node.type === tt.BIN_OPERATOR) {
		if (
			target.type === tt.BIN_OPERATOR
			&& getNodeOrder(node) > getNodeOrder(target)
		) {
			target.right = pushItemToNode(node, target.right)
			return target
		}

		node.left = target
		return node
	}

	if (target.type === tt.BIN_OPERATOR) {
		target.right = target.right	? pushItemToNode(node, target.right) : node
	}
	return target
}
