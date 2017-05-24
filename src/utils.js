// @flow
export const warning = (error: string) => (
	// eslint-disable-next-line no-console
	console.error(
		`\nWe just had an error.\n ${error.replace(/\t/g, '').trim()}`,
	)
)

// a nice getter like python for arrays
export const get = <T>(arr: T[], i: number): T => (
	arr[i < 0 ? arr.length + i : i]
)

// get the max value inside an array
export const max = <T>(arr: T[], method: (T, T) => bool): T => (
	arr.reduce((maxItem, cur) => (
		method(maxItem, cur) ? cur : maxItem
	))
)

export const has = (obj: mixed, key: string) => (
	Object.prototype.hasOwnProperty.call(obj, key)
)

export const flat = <T>(arr: T[][]): T[] => (
	arr.reduce((val, cur) => [...val, ...cur], [])
)

export async function benchmark<T: *[]>(func: (...T) => mixed, args: T, time: number = 1000) {
	let times = 0
	let timeSum = 0
	let start
	let end

	while (timeSum < time) {
		/* using array destruction because this is much
		* faster than assigning values. and speed is
		* what matter because it is a benchmark */
		[start,, end] = [
			Date.now(),
			func(...args),
			Date.now(),
		]

		timeSum += end - start
		times += 1
	}

	return Math.floor(times / (time / 1000))
}

export const pluralize = (num: number, item: string, items: string) => (
	num === 1 ? item : items
)

