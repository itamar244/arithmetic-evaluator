// @flow
import type { Program, Statement } from '../types'
import {
	type Scope,
	variableDeclarationsToObject,
} from './utils'
import link from './linker'
import {
	EvalNull,
	type EvalValue,
} from './values'
import evaluateNode from './evaluate-node'

export function evaluateStatement(
	statement: Statement,
	scope: Scope,
) {
	if (statement.type === 'FunctionDeclaration') {
		if (scope[statement.id.name] != null) {
			throw new Error(`function ${statement.id.name} is already defined`)
		}
		scope[statement.id.name] = statement
		return new EvalNull()
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
): EvalValue {
	let value = new EvalNull()

	for (const statement of link(program)) {
		value = evaluateStatement(statement, scope)
	}

	return value
}
