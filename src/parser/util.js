// @flow
import * as tt from '../tokenizer/types'
import Node from './node'

export default function pushItemToNode(node: Node, target: Node) {
	if (node.type === tt.BIN_OPERATOR) {
		if (
			target.type === tt.BIN_OPERATOR
			&& node.getOrder() > target.getOrder()
		) {
			return target.set(
				'right',
				pushItemToNode(node, target.right),
			)
		}

		return node.set('left', target)
	}

	return target.set(
		'right',
		target.right != null
		? pushItemToNode(node, target.right)
		: node,
	)
}
