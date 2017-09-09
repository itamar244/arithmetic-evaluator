// @flow
import type {
	Location,
	NodeBase,
	Node as NodeType,
} from '../types'
import { type Token } from '../tokenizer/types'
import State from './state'

class Node implements NodeBase {
	type: any
	loc: Location
	raw: string

	constructor(type: string, raw: string, start: number) {
		this.type = type
		this.raw = raw
		this.loc = {
			start,
			end: start + raw.length,
		}
	}
}

export default class NodeUtils {
	// forward declarations
	state: State

	createNode<T: NodeType>(type: string, match: string): T {
		// $FlowIgnore
		return new Node(type, match, this.state.pos)
	}

	createNodeFromToken(token: Token) {
		return this.createNode(token.type, token.match)
	}
}
