// @flow
export class Position {
	line: number
	column: number

	constructor(line: number, column: number) {
		this.line = line
		this.column = column
	}
}

export class SourceLocation {
	start: Position;
	end: Position;

	constructor(start: Position, end?: Position) {
		this.start = start
		// $FlowIgnore (may start as null, but initialized later)
		this.end = end
	}
}
