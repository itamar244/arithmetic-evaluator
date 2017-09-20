// @flow
import type {
	Location,
	NodeBase,
	Node,
	AnyNode,
	NodeType,
} from '../types'
import State from './state'

export default class NodeUtils {
	// forward declarations
	state: State

	startNode<T: Node>(raw: string): T {
		// $FlowIgnore
		return {
			raw,
			loc: {
				start: this.state.pos,
				end: this.state.pos,
			}
		}
	}

	finishNode<T: AnyNode>(node: T, type: NodeType): T {
		node.type = type
		node.loc.end = this.state.pos
		return node
	}
}
