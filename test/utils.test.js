// @flow
import test from 'ava'
import { has } from '../src/utils'

test('utils should work', (t) => {
	const OBJECT = { x: 3, y: undefined }

	t.true(has(OBJECT, 'x'))
	t.true(has(OBJECT, 'y'))
	t.false(has(OBJECT, 'z'))
})
