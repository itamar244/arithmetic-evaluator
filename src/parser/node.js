// @flow
import type {
	Location,
	NodeBase,
	Node as NodeType,
} from '../types'
import State from './state'

class Node implements NodeBase {
	type: any
	loc: Location
	raw: string

	constructor(raw: string, start: number) {
		this.raw = raw
		this.loc = {
			start,
			end: start,
		}
	}
}

export default class NodeUtils {
	// forward declarations
	state: State

	startNode<T: NodeType>(raw: string): T {
		// $FlowIgnore
		return new Node(this.state.pos, raw)
	}

	finishNode<T: NodeType>(node: T, type: string): T {
		// $FlowFixMe
		node.type = type
		node.loc.end = this.state.pos
		return node
	}
}
