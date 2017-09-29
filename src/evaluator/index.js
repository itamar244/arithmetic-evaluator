// @flow
import type {
	Program,
	Statement,
} from '../types'
import evaluateNode from './eval'
import {
	variableDeclarationsToObject,
	type Scope,
} from './utils'

export const createEvaluateStatement = () => {
	const scope: Scope = {}

	return (statement: Statement) => {
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
}

export function evaluate(program: Program): null | number {
	const evaluateStatement = createEvaluateStatement()

	return program.body.reduce((val, statement) => (
		evaluateStatement(statement)
	), null)
}
