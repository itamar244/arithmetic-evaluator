/**
 * Copyright 2017-present, Itamar Yatom.
 * All rights reserved.
 *
 * Useful mathemtical functions that aren't defined in Math object.
 * They are being used as builtin functions alongside Math's functions.
 * each function has the following type: (...args: EvalValue[]) => EvalValue
 * functions should throw if arguments's type are incorrect
 */
import {
	EvalNumber,
	EvalVector,
	EvalNull,
	EvalValue,
} from './values'
import {
	log as normalizedLog,
	ln as normalizedLn,
	cos as normalizedCos,
	tan as normalizedTan,
} from './math'

export const CONST_LITERALS = {
	null: new EvalNull(),
	inf: new EvalNumber(Infinity),
	nan: new EvalNumber(NaN),
}

export const RUNTIME_FUNCTIONS = {
	fact, fib, cos, tan, abs, vec, log, ln,
}

export function fact(n: EvalValue) {
	const { value } = n.expect<EvalNumber>('Number')
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
	return normalizedLog(
		base.expect<EvalNumber>('Number').value,
		x.expect<EvalNumber>('Number').value,
	)
}

export function ln(x: EvalValue) {
	return normalizedLn(x.expect<EvalNumber>('Number').value)
}

export function vec(x: EvalValue, y: EvalValue) {
	return new EvalVector(
		x.expect<EvalNumber>('Number'),
		y.expect<EvalNumber>('Number'),
	)
}
