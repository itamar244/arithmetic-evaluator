// @flow
import type { Program, Statement } from '../types'
import {
	variableDeclarationsToObject,
	type Scope,
} from './utils'
import link from './linker'
import evaluateNode from './eval'

export function evaluateStatement(
	statement: Statement,
	scope: Scope,
) {
	if (statement.type === 'FunctionDeclaration') {
		if (scope[statement.id.name] != null) {
			throw new Error(`function ${statement.id.name} is already defined`)
		}
		scope[statement.id.name] = statement
		return null
	}

	if (statement.type === 'VariableDeclerations') {
		return evaluateNode(
			statement.expression,
			[variableDeclarationsToObject(statement), scope],
		)
	}

	return evaluateNode(statement, [scope])
}

export function evaluate(
	program: Program,
	scope: Scope = {},
): null | number {
	let value = null

	for (const statement of link(program)) {
		value = evaluateStatement(statement, scope)
	}

	return value
}
