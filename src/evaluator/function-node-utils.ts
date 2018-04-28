import {
	Identifier,
	FunctionDeclaration,
	ParameterDeclaration,
} from '../types'
import { Scope } from './scope'
import { EvalValue } from './values'

export function validateArgs(
	name: string,
	funcParams: number,
	providedArgs: number,
	allowInfinite: boolean,
) {
	if (funcParams !== providedArgs && (!allowInfinite || funcParams > 0)) {
		throw RangeError(
			`wrong number of arguments: '${name}'`
			+ ` needed ${funcParams}`
			+ `, intead of ${providedArgs}`,
		)
	}
}

function validateTypeArgs(name, funcParams, providedArgs) {
	if (funcParams !== providedArgs) {
		throw RangeError(
			`wrong number of type arguments: '${name}'`
			+ ` needed ${funcParams}`
			+ `, intead of ${providedArgs}`,
		)
	}
}

function validateDeclMatchArg(
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
			validateDeclMatchArg(
				name,
				definedType,
				arg.type,
				`${declTypeName} as ${definedType}`,
			)
		} else {
			genericDefinitions.set(declTypeName, arg.type)
		}
	} else {
		validateDeclMatchArg(name, declTypeName, arg.type)
	}
}

export function getFunctionScope(
	func: FunctionDeclaration,
	typeArgs: null | Identifier[],
	args: EvalValue[],
): Scope {
	const scope = new Map()
	const genericDefinitions = new Map()
	const { typeDefinitions } = func

	validateArgs(func.id.name, func.params.length, args.length, false)

	if (typeArgs !== null) {
		if (typeDefinitions === null) {
			throw Error(`generic call types were used but function doesn't accept any`)
		}
		validateTypeArgs(func.id.name, typeDefinitions.length, typeArgs.length)
		for (let i = 0; i < typeArgs.length; i += 1) {
			genericDefinitions.set(typeDefinitions[i].name, typeArgs[i].name)
		}
	}

	for (let i = 0; i < args.length; i += 1) {
		validateArgTypeMatch(
			typeDefinitions,
			genericDefinitions,
			args[i],
			func.params[i],
		)
		scope.set(func.params[i].id.name, args[i])
	}

	return scope
}
