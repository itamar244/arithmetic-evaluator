// @flow
import { readFileSync } from 'fs'
import { resolve } from 'path'

import type { Program, Statement } from '../types'
import { parse } from '../index'

const resolveImportPath = (path: string) => (
	resolve(path.endsWith('.ari') ? path : `${path}.ari`)
)

export default function link(program: Program): Statement[] {
	const imports: Set<string> = new Set()
	const linkBody = (body: Statement[]) => {
		const statements = []

		for (const statement of body) {
			if (statement.type === 'Import') {
				const resolvedPath = resolveImportPath(statement.path)

				if (!imports.has(resolvedPath)) {
					const importedProgram = parse(String(readFileSync(resolvedPath)))

					imports.add(resolvedPath)
					statements.push(...linkBody(importedProgram.body))
				}
			} else {
				statements.push(statement)
			}
		}

		return statements
	}

	return linkBody(program.body)
}
