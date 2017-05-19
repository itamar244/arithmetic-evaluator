// @flow
import type { TreeItemType } from './'
import * as t from './types'
import { isOperator } from './../operators'

const PATTERNS = {
	number: /^[-+]?(?:(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?|^Infinity)/,
	function: /^[a-z][a-z]+\(.+\)/,
	constant: /^[A-Z][A-Z0-9]+|^[A-Z]/
}

const matchingBracket = (str: string, index: number, start, end) => {
	let amountOfOpenBrackets = 0
	for (let i = index + 1, len = str.length; i < len; i++) {
		if (start.indexOf(str[i]) >= 0) {
			amountOfOpenBrackets += 1
		} else if (end.indexOf(str[i]) >= 0) {
			amountOfOpenBrackets -= 1

			if (amountOfOpenBrackets === -1) {
				return i
			}
		}
	}
	throw 'wrong brackets amount'
}


const match = (type: TreeItemType, match: string) => ({ type, match });

export default class UtilParser {
	getMatch(str: string, regexp: RegExp): string {
		return (str.match(regexp) || [''])[0]
	}

	inferTypeAndMatch(str: string) {
		const char = str.charAt(0)

		if (char === '|') {
			return match(t.ABS_BRACKETS, str.slice(0, matchingBracket(str, 0, '(', '|)') + 1))
		}
		if (isOperator(char)) {
			return match(t.OPERATOR, char)
		}

		const func = this.getMatch(str, PATTERNS.function)
		// if there is the following case <func>(<str>)...() the last bracket will fit, so this manually fix it
		if (func) {
			const matchedBracketIndex = matchingBracket(func, func.indexOf('('), '(', ')')
			return match(t.FUNCTION, func.slice(0, matchedBracketIndex + 1))
		}

		if (char.match(/[a-z]/)) {
			return match(t.PARAM, char)
		}

		const constant = this.getMatch(str, PATTERNS.constant)
		if (typeof Math[constant] === 'number') {
			return match(t.CONSTANT, constant)
		}

		const num = this.getMatch(str, PATTERNS.number)
		if (num) {
			return match(t.NUMBER, num)
		}

		if(char === '(') {
			return match(t.BRACKETS, str.slice(0, matchingBracket(str, 0, '(', ')') + 1))
		}

		return match(t.ERROR, str[0])
	}
}
