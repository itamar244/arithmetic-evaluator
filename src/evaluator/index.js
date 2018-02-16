// @flow
import type { Program, Statement } from '../types'
import { type Scope } from './utils'
import link from './linker'
import {
	EvalNull,
	EvalFunction,
	type EvalValue,
} from './values'
import evaluateNode from './evaluate-node'

const variableDeclarationsToScope = (node, scopes) => (
	node.declarations.reduce((scope, declaration) => {
		scope[declaration.id.name] = evaluateNode(declaration.init, scopes)
		return scope
	}, {})
)

export function evaluateStatement(
	statement: Statement,
	scope: Scope,
) {
	if (statement.type === 'FunctionDeclaration') {
		if (scope[statement.id.name] != null) {
			throw new Error(`function ${statement.id.name} is already defined`)
		}
		scope[statement.id.name] = new EvalFunction(statement)
		return new EvalNull()
	}

	if (statement.type === 'VariableDeclerations') {
		return evaluateNode(
			statement.expression,
			[variableDeclarationsToScope(statement, [scope]), scope],
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
