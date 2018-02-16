// @flow
export const ln = Math.log
export const log = (base: number, x: number) => (
	Math.log(x) / Math.log(base)
)

const CIRCLE_PERIMETER = Math.PI * 2

function fixedAngle(angle: number) {
	const dir = angle >= 0 ? 1 : -1
	let fixed = angle

	while (fixed * dir > CIRCLE_PERIMETER) {
		fixed -= CIRCLE_PERIMETER * dir
	}

	return fixed
}

// normalized trigonometrical functions
export function cos(angle: number) {
	const fixed = fixedAngle(angle)
	return fixed !== Math.PI / 2 ? Math.cos(fixed) : 0
}

export function tan(angle: number) {
	const fixed = fixedAngle(angle)
	if (fixed === Math.PI / 2) return Infinity
	if (fixed === Math.PI) return 0
	if (fixed === Math.PI * 1.5) return -Infinity
	return Math.tan(fixed)
}
