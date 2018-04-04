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
	startNode(): AnyNode {
		return (new Node(this.state.startLoc, this.state.pos): any)
	}

	// eslint-disable-next-line class-methods-use-this
	startNodeAtNode(node: Node | AnyNode): AnyNode {
		return (new Node(node.loc.start, node.start): any)
	}

	finishNode<T: NodeObject>(node: T, type: NodeType): T {
		node.type = (type: any)
		node.end = this.state.prevEnd
		node.loc.end = this.state.prevEndLoc
		return node
	}
}
