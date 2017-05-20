// @flow
export const warning = (error: string) =>
	console.error(
		'\nWe just had an error.\n' +
		error.replace(/\t/g, '').trim())

// a nice getter like python for arrays
export const get = <T>(arr: T[], i: number): T => (
	arr[i < 0 ? arr.length + i : i]
)

// get the max value inside an array
export const max = <T>(arr: T[], method: (T, T) => mixed) => (
	arr.reduce((max, cur) => (
		method(max, cur) ? cur : max
	))
)


export const joinSets = <T>(...sets: Set<T>[]): Set<T> => {
	const res = new Set()

	sets.forEach(set => set.forEach(item => res.add(item)))

	return res
}

export const has = (obj: mixed, key: string) => (
	Object.prototype.hasOwnProperty.call(obj, key)
)
