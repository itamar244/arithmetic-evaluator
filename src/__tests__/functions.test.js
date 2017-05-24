// @flow
/* eslint-env jest */
import isNotValidFunction, { functions } from '../functions'

it('functions should be defined', () => {
	for (const [name, length] of functions) {
		// $FlowIgnore
		expect(isNotValidFunction(name, { length })).toBe(false)
	}
})
