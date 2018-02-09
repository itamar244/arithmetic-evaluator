// @flow
import test from 'ava'
import {
	binaryOperator,
	unaryOperator,
} from './operators'

test('evaluate operator should throw with wrong operators', (t) => {
	t.throws(
		// $FlowIgnore
		() => binaryOperator('#', 0, 0),
		"# isn't supported as a binary operator",
	)

	t.throws(
		// $FlowIgnore
		() => unaryOperator('#', 0),
		"# isn't supported as an unary operator",
	)
})
