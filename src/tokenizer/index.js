// @flow
import toToken from './util'
import { getMatch } from '../utils'

export type { Token } from './types'

export default function toTokens(str: string) {
	const tokens = []
	let pos = 0

	while (pos < str.length) {
		if (str[pos] === ' ') {
			pos += getMatch(str.slice(pos), /\s+/).length
		} else {
			const token = toToken(pos, str)
			pos += token.end - token.start
			tokens.push(token)
		}
	}

	return tokens
}
