// @flow
import { SourceLocation, type Position } from '../utils/location'
import type {
	AnyNode,
	NodeType,
	Node as NodeObject,
	NodeBase,
} from '../types'
import UtilParser from './util'

export class Node implements NodeBase {
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
		node.type = (type: any)
		node.end = this.state.prevEnd
		node.loc.end = this.state.prevEndLoc
		return node
	}
}
