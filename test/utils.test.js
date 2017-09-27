// @flow
import test from 'ava'
import {
	pluralize,
	benchmark,
	has,
} from '../src/utils'


test('utils should work', (t) => {
	const WORDS_SETS = ['word', 'words']
	const OBJECT = { x: 3, y: undefined }

	t.is(pluralize(0, ...WORDS_SETS), WORDS_SETS[1])
	t.is(pluralize(1, ...WORDS_SETS), WORDS_SETS[0])
	t.is(pluralize(2, ...WORDS_SETS), WORDS_SETS[1])

	t.is(typeof benchmark(() => null, [], 10), 'number', 'benchmark returns a number')

	t.true(has(OBJECT, 'x'))
	t.true(has(OBJECT, 'y'))
	t.false(has(OBJECT, 'z'))
})
