// @flow
/* eslint-env jest */
import isNotValidFunction, { functions } from '../functions'

it('functions should be defined', () => {
	for (const [name, length] of functions) {
		if (length !== Infinity) {
			expect(isNotValidFunction(name, new Array(length))).toBe(null)
		}
	}
})

it('wrong functions would return strings', () => {
	expect(isNotValidFunction('cos', new Array(2))).not.toBe(null)
})
