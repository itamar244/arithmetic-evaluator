// @flow
import type { TreeItemType } from './'
import * as tt from './types'
import { isOperator } from './../operators'

const PATTERNS = {
	number: /^[-+]?(?:(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?|^Infinity)/,
	function: /^[a-z][a-z]+\(.+\)/,
	constant: /^[A-Z][A-Z0-9]+|^[A-Z]/
}

const match = (type: TreeItemType, match: string) => ({ type, match });

export default class UtilParser {
	_matchingBracket(str: string, index: number, start: string, end: string) {
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
		this.unexpected('wrong brackets amount')
	}

	getMatch(str: string, regexp: RegExp) {
		return (str.match(regexp) || [''])[0]
	}

	inferTypeAndMatch(pos: number, str: string) {
		const char = str.charAt(pos)

		if (isOperator(char) && pos > 0) {
			return match(tt.OPERATOR, char)
		}

		if(char === '(') {
			return match(tt.BRACKETS,
				str.slice(pos, this._matchingBracket(str, pos, '(', ')') + 1)
			)
		}

		if (char === '|') {
			return match(tt.ABS_BRACKETS,
				str.slice(pos, this._matchingBracket(str, pos, '(', '|)') + 1)
			)
		}

		str = str.slice(pos)

		const num = this.getMatch(str, PATTERNS.number)
		if (num) {
			return match(tt.NUMBER, num)
		}


		const func = this.getMatch(str, PATTERNS.function)
		// if there is the following case <func>(<str>)...() the last bracket will fit, so this manually fix it
		if (func) {
			const matchedBracketIndex = this._matchingBracket(func, func.indexOf('('), '(', ')')
			return match(tt.FUNCTION, func.slice(0, matchedBracketIndex + 1))
		}

		// needs to be after function because they both start with a char
		if (char.match(/[a-z]/)) {
			return match(tt.PARAM, char)
		}

		const constant = this.getMatch(str, PATTERNS.constant)
		if (constant && typeof Math[constant] === 'number') {
			return match(tt.CONSTANT, constant)
		}

		return match(tt.ERROR, str[0])
	}

	unexpected(error: string) {
		throw error
	}
}
