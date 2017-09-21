// @flow
import type {
	AnyNode,
	NodeType,
	Node,
} from '../types'
import Utils from '../utils/common-class'
import State from './state'

export default class NodeUtils extends Utils {
	// forward declarations
	state: State

	startNode(): AnyNode {
		return {
			loc: {
				start: this.state.start,
				end: this.state.start,
			},
		}
	}

	finishNode<T: AnyNode>(node: T, type: NodeType): T {
		node.type = type
		node.loc.end = this.state.pos
		return node
	}
}
