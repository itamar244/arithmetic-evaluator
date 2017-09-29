// @flow
import type {
	Program,
	Statement,
} from '../types'
import {
	variableDeclarationsToObject,
	type Scope,
} from './utils'
import evaluateNode from './eval'

export function evaluateStatement(
	statement: Statement,
	scope: Scope,
) {
	if (statement.type === 'FunctionDeclaration') {
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

export function evaluate(program: Program): null | number {
	const scope = {}
	let value = null

	for (const statement of program.body) {
		value = evaluateStatement(statement, scope)
	}

	return value
}
