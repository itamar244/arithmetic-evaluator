// @flow
import type { Program, Statement } from '../types'
import type { Scope } from './scope'
import link from './linker'
import {
	EvalNull,
	EvalFunction,
	type EvalValue,
} from './values'
import { CONST_LITERALS } from './runtime-values'
import evaluateNode from './evaluate-node'

const variableDeclarationsToScope = (node, scopes) => (
	node.declarations.reduce((scope, declaration) => {
		scope.set(declaration.id.name, evaluateNode(declaration.init, scopes))
		return scope
	}, new Map())
)

export type { Scope }

export function evaluateStatement(
	statement: Statement,
	scope: Scope,
) {
	if (statement.type === 'FunctionDeclaration') {
		if (scope.has(statement.id.name)) {
			throw new Error(`function ${statement.id.name} is already defined`)
		}
		scope.set(statement.id.name, new EvalFunction(statement))
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

export function evaluate(program: Program): EvalValue {
	const topScope: Scope = new Map()
	let value = CONST_LITERALS.null

	for (const statement of link(program)) {
		value = evaluateStatement(statement, topScope)
	}

	return value
}
