// @flow
import type { Token } from './types'
import toToken from './util'
import { getMatch } from '../utils'

export type { Token }
export { toToken }

export default function toTokens(str: string): Token[] {
	const tokens = []
	let pos = 0

	while (pos < str.length) {
		if (str[pos] === ' ') {
			pos += getMatch(str.slice(pos), /\s+/).length
		} else {
			const token = toToken(pos, str)
			pos += token.match.length
			tokens.push(token)
		}
	}

	return tokens
}
