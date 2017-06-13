// @flow
import * as tt from './types'
import { isOperator } from './../operators'
import { getMatch } from '../utils'

const PATTERNS = {
	number: /^(?:(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?|^Infinity)/,
	function: /^[a-z][a-z]+\(.*\)/,
	constant: /^[A-Z][A-Z0-9]+|^[A-Z]/,
}

const match = (type: tt.TokenType, m) => ({ type, match: m })

const matchingBracket = (str: string, index: number, start: string, end: string) => {
	let amountOfOpenBrackets = 0
	for (let i = index + 1, len = str.length; i < len; i += 1) {
		if (start.indexOf(str[i]) >= 0) {
			amountOfOpenBrackets += 1
		} else if (end.indexOf(str[i]) >= 0) {
			amountOfOpenBrackets -= 1

			if (amountOfOpenBrackets === -1) {
				return i
			}
		}
	}

	throw Error('wrong amount of brackets')
}

export default function toToken(pos: number, blob: string) {
	const char = blob.charAt(pos)

	if (isOperator(char)) {
		return match(tt.BIN_OPERATOR, char)
	}

	const str = blob.slice(pos)

	if (/^\(.*\)/.test(str)) {
		return match(
			tt.BRACKETS,
			blob.slice(pos, matchingBracket(blob, pos, '(', ')') + 1),
		)
	}

	if (/^\|.*\|/.test(str)) {
		return match(
			tt.ABS_BRACKETS,
			blob.slice(pos, matchingBracket(blob, pos, '(', '|)') + 1),
		)
	}

	const num = getMatch(str, PATTERNS.number)
	if (num) {
		return match(tt.LITERAL, num)
	}


	const func = getMatch(str, PATTERNS.function)
	// if there is the following case <func>(<str>)...() the last bracket will fit,
	// so this manually fix it
	if (func) {
		const matchedBracketIndex = matchingBracket(func, func.indexOf('('), '(', ')')
		return match(tt.FUNCTION, func.slice(0, matchedBracketIndex + 1))
	}

	// needs to be after function because they both start with a char
	if (char.match(/[a-z]/)) {
		return match(tt.PARAM, char)
	}

	const constant = getMatch(str, PATTERNS.constant)
	if (constant) {
		return match(tt.CONSTANT, constant)
	}

	return match(tt.ERROR, char)
}
