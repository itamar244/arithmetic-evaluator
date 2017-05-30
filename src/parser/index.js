// @flow
import Statement from './statement'

export default function parse(blob: string) {
	return new Statement(blob)
}
