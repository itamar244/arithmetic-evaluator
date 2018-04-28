export const has = (obj: any, key: string) => (
	Object.prototype.hasOwnProperty.call(obj, key)
)
