// @flow
import type {
	Identifier,
	FunctionDeclaration,
	ParameterDeclaration,
} from '../types'
import { CONST_LITERALS } from './runtime-values'
import type { EvalValue } from './values'

export type Scope = Map<string, EvalValue>

export function getItemFromScopes(
	scopes: Scope[],
	name: string,
): EvalValue {
	for (const scope of scopes) {
		const value = scope.get(name);
		if (value != null) {
			return value
		}
	}
	return CONST_LITERALS.null
}

export function validateArgs(
	name: string,
	funcParams: number,
	providedArgs: number,
	allowInfinite: bool,
) {
	if (funcParams !== providedArgs && (!allowInfinite || funcParams > 0)) {
		throw RangeError(
			`wrong number of arguments: '${name}'`
			+ ` needed ${funcParams}`
			+ `, intead of ${providedArgs}`,
		)
	}
}

function expectDeclMatchArg(
	name: string,
	declTypeName: string,
	argType: string,
	expectedTypeName: string = declTypeName,
) {
	if (declTypeName !== 'any' && declTypeName !== argType) {
		throw TypeError(`expected ${expectedTypeName} for ${name}, not ${argType}`)
	}
}

function validateArgTypeMatch(
	typeDefinitions: null | Identifier[],
	genericDefinitions: Map<string, string>,
	arg: EvalValue,
	param: ParameterDeclaration,
) {
	if (param.declType === null) return

	const declTypeName = param.declType.name
	const name = param.id.name

	if (
		typeDefinitions !== null
		&& typeDefinitions.some(def => def.name === declTypeName)
	) {
		const definedType = genericDefinitions.get(declTypeName)

		if (definedType !== undefined) {
			expectDeclMatchArg(
				name,
				definedType,
				arg.type,
				`${declTypeName} as ${definedType}`,
			)
		} else {
			genericDefinitions.set(declTypeName, arg.type)
		}
	} else {
		expectDeclMatchArg(name, declTypeName, arg.type)
	}
}

export function getFunctionScope(
	func: FunctionDeclaration,
	typeArgs: null | Identifier[],
	args: EvalValue[],
): Scope {
	const scope = new Map()
	const genericDefinitions = new Map()

	validateArgs(func.id.name, func.params.length, args.length, false)

	if (func.typeDefinitions !== null && typeArgs !== null) {
		for (let i = 0; i < typeArgs.length; i += 1) {
			genericDefinitions.set(func.typeDefinitions[i].name, typeArgs[i].name)
		}
	}

	for (let i = 0; i < args.length; i += 1) {
		validateArgTypeMatch(
			func.typeDefinitions,
			genericDefinitions,
			args[i],
			func.params[i],
		)
		scope.set(func.params[i].id.name, args[i])
	}

	return scope
}
