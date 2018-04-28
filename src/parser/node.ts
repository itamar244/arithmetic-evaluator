import { SourceLocation, Position } from '../utils/location'
import {
	AnyNode,
	NodeType,
	Node as NodeObject,
	NodeBase,
} from '../types'
import UtilParser from './util'

export class Node implements NodeBase {
	start: number;
	end: number;
	loc: SourceLocation;

	constructor(start: Position, pos: number) {
		this.start = pos
		this.end = 0
		this.loc = new SourceLocation(start)
	}
}

export default class NodeUtils extends UtilParser {
	startNode(): any {
		return new Node(this.state.startLoc, this.state.start)
	}

	// eslint-disable-next-line class-methods-use-this
	startNodeAtNode(node: NodeBase): any {
		return new Node(node.loc.start, node.start)
	}

	finishNode<T extends NodeObject>(node: T, type: T['type']): T {
		node.type = type
		node.end = this.state.prevEnd
		node.loc.end = this.state.prevEndLoc
		return node
	}
}
