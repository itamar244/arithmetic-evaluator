/**
 * Copyright 2017-present, Itamar Yatom.
 * All rights reserved.
 *
 * Useful mathemtical functions that aren't defined in Math object.
 * They are being used as builtin functions alongside Math's functions.
 * each function has the following type: (...args: EvalValue[]) => EvalValue
 * functions should throw if arguments's type are incorrect
 *
 * @flow
 */
import {
	EvalNumber,
	EvalVector,
	EvalNull,
	type EvalValue,
} from './values';
import {
	log as normalizedLog,
	ln as normalizedLn,
	cos as normalizedCos,
	tan as normalizedTan,
} from './math';

export const CONST_LITERALS = {
	null: new EvalNull(),
	inf: new EvalNumber(Infinity),
}

export function fact(n: EvalValue) {
	if (n.type !== 'Number') throw n.unexpected('number')
	const { value } = n
	let result = 1
	for (let i = 1; i <= value; i += 1) {
		result *= i
	}
	return new EvalNumber(result)
}

export function fib(n: EvalValue) {
	if (n.type !== 'Number') throw n.unexpected('number')
	const { value } = n
	if (value === 0) return 0
	let prev = 0
	let cur = 1

	for (let i = 0; i < value; i += 1) {
		const temp = cur
		cur += prev
		prev = temp
	}

	return new EvalNumber(cur)
}

export function cos(angle: EvalValue) {
	if (angle.type !== 'Number') throw angle.unexpected('number')
	return new EvalNumber(normalizedCos(angle.value))
}

export function tan(angle: EvalValue) {
	if (angle.type !== 'Number') throw angle.unexpected('number')
	return new EvalNumber(normalizedTan(angle.value))
}

export function abs(n: EvalValue) {
	return n.abs()
}

export function log(base: EvalValue, x: EvalValue) {
	if (base.type !== 'Number') throw base.unexpected('number')
	if (x.type !== 'Number') throw x.unexpected('number')
	return normalizedLog(base.value, x.value)
}

export function ln(x: EvalValue) {
	if (x.type !== 'Number') throw x.unexpected('number')
	return normalizedLn(x.value)
}

export function vec(x: EvalValue, y: EvalValue) {
	if (x.type !== 'Number') throw x.unexpected('number')
	if (y.type !== 'Number') throw y.unexpected('number')
	return new EvalVector(x, y)
}
