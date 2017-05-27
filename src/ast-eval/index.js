// @flow
import typeof Node from '../ast-parser/node'
import { operators } from '../operators'
import * as tt from '../tokenizer/types'

const evaluateExpression = (node: Node) => (
	node.is('EXPRESSION')
	? evaluateExpression(node.body)
	: node.is(tt.LITERAL)
	?	node.value
	: node.is(tt.CONSTANT)
	? Math[node.name]
	: node.is(tt.BIN_OPERATOR) && operators[node.operator]
	? operators[node.operator](
		node.left ? evaluateExpression(node.left) : 0,
		evaluateExpression(node.right),
	)
	: node.is(tt.FUNCTION)
	? Math[node.name](...node.arguments.map(evaluateExpression))
	: 0
)

export default evaluateExpression
