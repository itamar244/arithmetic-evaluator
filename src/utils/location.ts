export class Position {
	constructor(
		readonly line: number,
		readonly column: number,
	) {
		this.line = line
		this.column = column
	}
}

export class SourceLocation {
	constructor(
		readonly start: Position,
		public end?: Position,
	) {
		this.start = start
		// $FlowIgnore (may start as null, but initialized later)
		this.end = end
	}
}
