/**
 * Copyright 2017-present, Itamar Yatom.
 * All rights reserved.
 *
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

// normalized trigonometrical functions
export function cos(angle: number) {
	if (Math.abs(angle) === Math.PI / 2) {
		return 0
	}
	return Math.cos(angle)
}

export function tan(angle: number) {
	if (angle === Math.PI / 2) return Infinity
	if (angle === Math.PI) return 0
	if (angle === Math.PI * 1.5) return -Infinity
	return Math.tan(angle)
}
