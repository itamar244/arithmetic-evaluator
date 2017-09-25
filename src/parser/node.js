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
	startNodeAt(start: number): AnyNode {
		// $FlowIgnore
		return new Node(start)
	}

	finishNode<T: NodeObject>(node: T, type: NodeType): T {
		node.type = (type: any)
		node.loc.end = this.state.pos
		return node
	}
}
