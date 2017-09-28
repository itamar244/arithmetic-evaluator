// @flow
import type {
	AnyNode,
	Location,
	NodeType,
	Node as NodeObject,
	NodeBase,
} from '../types'
import UtilParser from './util'

class Node implements NodeBase {
	loc: Location

	constructor(start: number) {
		this.loc = {
			start,
			end: 0,
		}
	}
}

export default class NodeUtils extends UtilParser {
	startNode(): AnyNode {
		// $FlowIgnore
		return new Node(this.state.start)
	}

	// eslint-disable-next-line class-methods-use-this
	startNodeAtNode(node: Node | AnyNode): AnyNode {
		// $FlowIgnore
		return new Node(node.loc.start)
	}

	finishNode<T: NodeObject>(node: T, type: NodeType): T {
		return this.finishNodeAt(
			node,
			this.state.end,
			type,
		)
	}

	// eslint-disable-next-line class-methods-use-this
	finishNodeAt<T: NodeObject>(node: T, end: number, type: NodeType): T {
		node.type = (type: any)
		node.loc.end = end
		return node
	}
}
