// @flow
export const has = (obj: Object, key: string) => (
	Object.prototype.hasOwnProperty.call(obj, key)
)

export async function benchmark<T: *[]>(func: (...T) => mixed, args: T, time: number = 1000) {
	const bindFunc = func.bind(null, ...args)
	let times = 0
	let timeSum = 0

	while (timeSum < time) {
		const start = Date.now()
		bindFunc()

		timeSum += Date.now() - start
		times += 1
	}

	return Math.floor(times / (time / 1000))
}

export const pluralize = (num: number, item: string, items: string) => (
	num === 1 ? item : items
)
