// @flow
import type {
	AnyNode,
	NodeType,
} from '../types'
import Tokenizer from '../tokenizer'

export default class NodeUtils extends Tokenizer {
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
