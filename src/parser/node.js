// @flow
import type {
	AnyNode,
	NodeType,
	Node,
} from '../types'
import UtilParser from './util'

export default class NodeUtils extends UtilParser {
	startNode(): AnyNode {
		return {
			loc: {
				start: this.state.start,
				end: this.state.start,
			},
		}
	}

	finishNode<T: Node>(node: T, type: NodeType): T {
		node.type = (type: any)
		node.loc.end = this.state.pos
		return node
	}
}
