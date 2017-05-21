// @flow
export const warning = (error: string) =>
	// eslint-disable-next-line no-console
	console.error(
		`\nWe just had an error.\n ${error.replace(/\t/g, '').trim()}`,
	)

// a nice getter like python for arrays
export const get = <T>(arr: T[], i: number): T => (
	arr[i < 0 ? arr.length + i : i]
)

// get the max value inside an array
export const max = <T>(arr: T[], method: (T, T) => mixed) => (
	arr.reduce((maxItem, cur) => (
		method(maxItem, cur) ? cur : maxItem
	))
)


export const joinSets = <T>(...sets: Set<T>[]): Set<T> => (
	sets.reduce((val, set) => {
		set.forEach(item => val.add(item))
		return val
	}, new Set())
)

export const has = (obj: mixed, key: string) => (
	Object.prototype.hasOwnProperty.call(obj, key)
)

export const flat = <T>(arr: T[][]): T[] => (
	arr.reduce((val, cur) => [...val, ...cur], [])
)
