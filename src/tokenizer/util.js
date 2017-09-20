// @flow
import * as tt from './types'
import { isOperator } from './../operators'
import { getMatch } from '../utils'

const PATTERNS = {
	number: /^(?:(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?|^Infinity)/,
	function: /^[a-z][a-z]+\(.*\)/,
	constant: /^[A-Z][A-Z0-9]+|^[A-Z]/,
}

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

const token = (type, start, end) => ({ type, start, end })

export default function toToken(pos: number, blob: string): tt.Token {
	const char = blob.charAt(pos)

	if (isOperator(char)) {
		return token(tt.OPERATOR, pos, pos + 1)
	}

	const str = blob.slice(pos)

	if (/^\(.*\)/.test(str)) {
		return token(
			tt.BRACKETS,
			pos,
			matchingBracket(blob, pos, '(', ')') + 1,
		)
	}

	if (/^\|.*\|/.test(str)) {
		return token(
			tt.ABS_BRACKETS,
			pos,
			matchingBracket(blob, pos, '', '|') + 1,
		)
	}

	const num = getMatch(str, PATTERNS.number)
	if (num) {
		return token(tt.LITERAL, pos, pos + num.length)
	}


	const func = getMatch(str, PATTERNS.function)
	// if there is the following case <func>(<str>)...() the last bracket will fit,
	// so this manually fix it
	if (func) {
		const matchedBracketIndex = matchingBracket(str, str.indexOf('('), '(', ')')
		return token(tt.FUNCTION, pos, pos + matchedBracketIndex + 1)
	}

	// needs to be after function because they both start with a char
	if (char.match(/[a-z]/)) {
		return token(tt.IDENTIFIER, pos, pos + 1)
	}

	const constant = getMatch(str, PATTERNS.constant)
	if (constant) {
		return token(tt.CONSTANT, pos, pos + constant.length)
	}

	return token(tt.ERROR, pos, pos + 1)
}
