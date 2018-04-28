import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'

import { Program, Statement } from '../types'
import { parse } from '../index'

export default function link(
	program: Program,
	imports: Set<string> = new Set(),
): Statement[] {
	const statements: Statement[] = []

	for (const statement of program.body) {
		if (statement.type === 'Import') {
			const filename = resolve(dirname(program.filename), statement.path)

			if (!imports.has(filename)) {
				const file = String(readFileSync(filename))
				const importedProgram = parse(file, { filename })

				imports.add(filename)
				statements.push(...link(importedProgram))
			}
		} else {
			statements.push(statement)
		}
	}

	return statements
}
