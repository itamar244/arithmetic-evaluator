// @flow
import * as tt from '../../tokenizer/types'

type Item = {
	type: string,
	raw?: string,
	body?: Item,
}

export const op = (operator: string, left?: Item, right: Item) => ({
	raw: operator,
	type: left != null ? tt.BIN_OPERATOR : tt.UNARY_OPERATOR,
	...(
		left != null
		? { left, right }
		: { argument: right }
	)
})

export const item = (type: string, raw: string): Item => ({
	type,
	raw,
})

export const expr = (body: Item): Item => ({
	body,
	type: 'EXPRESSION',
})

export const func = (name: string, ...args: Item[]) => ({
	args: args.map(expr),
	type: tt.FUNCTION,
})

// this file is tested, so testing should be added
it('', () => {})
