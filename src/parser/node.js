// @flow
import { SourceLocation, type Position } from '../utils/location';
import type {
	AnyNode,
	NodeType,
	Node as NodeObject,
	NodeBase,
} from '../types'
import UtilParser from './util'

class Node implements NodeBase {
	start: number
	end: number
	loc: SourceLocation

	constructor(start: Position) {
		this.start = start.column
		this.end = 0
		this.loc = new SourceLocation(start)
	}
}

export default class NodeUtils extends UtilParser {
	startNode(): AnyNode {
		// $FlowIgnore
		return new Node(this.state.startLoc)
	}

	// eslint-disable-next-line class-methods-use-this
	startNodeAtNode(node: Node | AnyNode): AnyNode {
		// $FlowIgnore
		return new Node(node.loc.start)
	}

	finishNode<T: NodeObject>(node: T, type: NodeType): T {
		return this.finishNodeAt(
			node,
			type,
			this.state.end,
			this.state.endLoc,
		)
	}

	// eslint-disable-next-line class-methods-use-this
	finishNodeAt<T: NodeObject>(
		node: T,
		type: NodeType,
		pos: number,
		loc: Position,
	): T {
		node.type = (type: any)
		node.end = pos
		node.loc.end = loc
		return node
	}
}
