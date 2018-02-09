// @flow
import * as n from '../../src/nodes'

export const variableDeclarations = (
	decls: Array<[string, n.Node]>,
	expression: n.Node,
): n.VariableDeclerations => new n.VariableDeclerations(
	decls
		.map(decl => new n.VariableDeclerator(new n.Identifier(decl[0]), decl[1])),
	new n.Expression(expression),
)
