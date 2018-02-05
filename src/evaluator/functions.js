/**
 * Useful mathemtical functions that aren't defined in Math object.
 * They are being used as builtin functions alongside Math's functions.
 *
 * @flow
 */

export function fact(n: number) {
	let result = 1
	for (let i = 1; i <= n; i += 1) {
		result *= i
	}
	return result
}

export function fib(n: number) {
	if (n === 0) return 0
	let prev = 0
	let cur = 1

	for (let i = 0; i < n; i += 1) {
		const temp = cur
		cur += prev
		prev = temp
	}

	return cur
}
