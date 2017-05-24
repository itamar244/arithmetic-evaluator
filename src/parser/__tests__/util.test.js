// @flow
/* eslint-env jest */
import UtilParser from '../util'
import * as tt from '../types'

const util = new UtilParser()

it("'3' should be { type: 'NUMBER', match: '3' }", () => {
	expect(util.inferTypeAndMatch(0, '3')).toMatchObject({
		type: tt.NUMBER,
		match: '3',
	})
})

it("'cos(3+3)' should be { type: 'FUNCTION', match: 'cos(3+3)' }", () => {
	expect(util.inferTypeAndMatch(0, 'cos(3+3)')).toMatchObject({
		type: tt.FUNCTION,
		match: 'cos(3+3)',
	})
})
