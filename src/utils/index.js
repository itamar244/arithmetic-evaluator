// @flow
export const has = (obj: Object, key: string) => (
	Object.prototype.hasOwnProperty.call(obj, key)
)
