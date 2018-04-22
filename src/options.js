// @flow
import { has } from './utils'

export type Options = {
	filename: string,
}

export const defaultOptions = {
	filename: 'anonymous',
}

export function getOptions(partial: ?$Shape<Options>): Options {
	if (partial == null) return defaultOptions
	const options: Object = {}

	for (const key in defaultOptions) {
		if (has(defaultOptions, key)) {
			options[key] = key in partial ? partial[key] : defaultOptions[key]
		}
	}

	return options
}
