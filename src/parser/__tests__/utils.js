// @flow
import * as tt from '../../tokenizer/types'

type Item = {
	type: string,
	raw?: string,
	body?: Item,
}

export const op = (operator: string, left?: Item, right: Item) => {
	const res = {
		operator,
		left,
		right,
		type: tt.BIN_OPERATOR,
	}
	if (!left) delete res.left
	return res
}

export const item = (type: string, raw: string): Item => ({
	type,
	raw,
})

export const expr = (body: Item): Item => ({
	body,
	type: 'EXPRESSION',
})

export const func = (name: string, ...args: Item[]) => ({
	arguments: args.map(expr),
	type: tt.FUNCTION,
})

// this file is tested, so testing should be added
it('', () => {})
