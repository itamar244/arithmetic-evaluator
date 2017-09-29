// @flow
export default function log(str: mixed, error: bool = false) {
	// eslint-disable-next-line no-console
	(error ? console.error : console.log)(str)
}
