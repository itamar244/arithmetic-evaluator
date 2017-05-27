// @flow
import typeof Node from '../parser/node'
import { operators } from '../operators'
import * as tt from '../tokenizer/types'

const evaluateExpression = (node: Node, params: { [string]: number }) => (
	node.type === 'EXPRESSION'
	? evaluateExpression(node.body, params)
	: node.type === tt.LITERAL
	?	node.value
	: node.type === tt.CONSTANT
	? Math[node.name]
	: node.type === tt.BIN_OPERATOR
	? operators[node.operator](
		node.left && evaluateExpression(node.left, params),
		evaluateExpression(node.right, params),
	)
	: node.type === tt.FUNCTION
	? Math[node.name](...node.arguments.map(arg => evaluateExpression(arg, params)))
	: node.type === tt.PARAM
	? params[node.name]
	: 0
)

export default evaluateExpression
