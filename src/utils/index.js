// @flow
export const has = (obj: Object, key: string) => (
	Object.prototype.hasOwnProperty.call(obj, key)
)

export const pluralize = (num: number, item: string, items: string) => (
	num === 1 ? item : items
)
