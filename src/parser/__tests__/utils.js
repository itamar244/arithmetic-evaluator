// @flow
type Item = {
	type: string;
}

export const eq = (left: Item, right: Item) => ({
	type: 'Equation',
	left,
	right,
})

export const op = (operator: string, left?: Item, right: Item) => ({
	type: left != null ? 'BinaryOperator' : 'UnaryOperator',
	...(
		left != null
		? { left, right }
		: { argument: right }
	),
})

export const item = (type: string, key: string, value: string | number | Item): Item => ({
	type,
	[key]: value,
})

export const expr = (body: Item): Item => ({
	body,
	type: 'Expression',
})

export const func = (name: string, ...args: Item[]) => ({
	args,
	type: 'Function',
})

// this file is tested, so testing should be added
it('', () => {})
