// @flow
import type {
	Program,
} from '../types'
import evaluateNode from './eval'
import { variableDeclarationsToObject, type Scope } from './utils'

export default function evaluateProgram(program: Program) {
	const scope: Scope = {}
	let expressionValue = NaN

	for (const statement of program.body) {
		if (statement.type === 'FunctionDeclaration') {
			scope[statement.id.name] = statement
		} else if (statement.type === 'VariableDeclerations') {
			expressionValue = evaluateNode(
				statement.expression,
				[variableDeclarationsToObject(statement), scope],
			)
		} else {
			expressionValue = evaluateNode(statement, [scope])
		}
	}
	return expressionValue
}
