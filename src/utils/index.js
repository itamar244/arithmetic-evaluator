// @flow
export const has = (obj: mixed, key: string) => (
	Object.prototype.hasOwnProperty.call(obj, key)
)
