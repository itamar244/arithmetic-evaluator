import test from 'ava'
import {
	binaryOperator,
	unaryOperator,
} from './operators'
import { CONST_LITERALS } from './runtime-values'

test('evaluate operator should throw with wrong operators', (t) => {
	t.throws(
		() => binaryOperator('#' as any, CONST_LITERALS.null, CONST_LITERALS.null),
		"# isn't supported as a binary operator",
	)

	t.throws(
		() => unaryOperator('#' as any, CONST_LITERALS.null),
		"# isn't supported as an unary operator",
	)
})
