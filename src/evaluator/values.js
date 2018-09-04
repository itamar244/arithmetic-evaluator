// @flow
import { cos } from './math'
import type { FunctionDeclaration } from '../types'

type RhsHandler = (rhs: EvalValue) => EvalValue

// polymorphic based class for EvalValue.
// each class should implement the functions that can be called by its value type
export class Value {
	// should be initialized for each value class
	+type: string;
	// all following fields should be implemented by subclasses
	// if they are supported by class
	+add: RhsHandler;
	+substract: RhsHandler;
	+multiply: RhsHandler;
	+divide: RhsHandler;
	+pow: RhsHandler;
	+modulo: RhsHandler;

	unspportedOperator(operator: string) {
		return Error(`'${this.type}' doesn't support ${operator} operator`)
	}

	unexpected(type: string) {
		return Error(`expected value of type '${type}', not '${this.type}'`)
	}

	rhsValueError(operator: string, rhs: EvalValue) {
		return Error(`'${this.type}' didn't expected rhs of type '${rhs.type}' from operator ${operator}`)
	}

	// func '|v|'
	abs() { throw this.unspportedOperator('abs') }
	// unary '-'
	negate() { throw this.unspportedOperator('-') }
	// binary '+'
	add() { throw this.unspportedOperator('+') }
	// binary '-'
	substract() { throw this.unspportedOperator('-') }
	// binary '*'
	multiply() { throw this.unspportedOperator('*') }
	// binary '/'
	divide() { throw this.unspportedOperator('/') }
	// binary '%'
	modulo() { throw this.unspportedOperator('%') }
	// binary '^'
	pow() { throw this.unspportedOperator('^') }
}

export type EvalValue =
	| EvalNull
	| EvalFunction
	| EvalNumber
	| EvalVector

export class EvalNull extends Value {
	+type: 'Null' = 'Null'

	// eslint-disable-next-line class-methods-use-this
	toString() { return 'null' }
}

export class EvalFunction extends Value {
	+value: FunctionDeclaration;
	+type: 'Function' = 'Function'

	constructor(value: FunctionDeclaration) {
		super()
		this.value = value
	}

	toString() {
		return `Function(${this.value.id.name})`
	}
}

export class EvalNumber extends Value {
	+value: number;
	+type: 'Number' = 'Number'

	constructor(value: number) {
		super()
		this.value = value
	}

	abs() {
		return new EvalNumber(Math.abs(this.value))
	}

	negate() {
		return new EvalNumber(-this.value)
	}

	add(rhs: EvalValue) {
		if (rhs.type !== 'Number') throw this.rhsValueError('+', rhs)
		return new EvalNumber(this.value + rhs.value)
	}

	substract(rhs: EvalValue) {
		if (rhs.type !== 'Number') throw this.rhsValueError('-', rhs)
		return new EvalNumber(this.value - rhs.value)
	}

	multiply(rhs: EvalValue) {
		if (rhs.type === 'Vector') {
			return rhs.scale(this)
		}
		if (rhs.type !== 'Number') throw this.rhsValueError('*', rhs)
		return new EvalNumber(this.value * rhs.value)
	}

	divide(rhs: EvalValue) {
		if (rhs.type !== 'Number') throw this.rhsValueError('/', rhs)
		return new EvalNumber(this.value / rhs.value)
	}

	toString() {
		return this.value.toString(10)
	}
}

export class EvalVector extends Value {
	+y: EvalNumber;
	+x: EvalNumber;
	+type: 'Vector' = 'Vector'

	constructor(x: EvalNumber, y: EvalNumber) {
		super()
		this.x = x
		this.y = y
	}

	angel() {
		return Math.atan2(this.y.value, this.x.value)
	}

	scale(scalar: EvalNumber) {
		return new EvalVector(this.x.multiply(scalar), this.y.multiply(scalar))
	}

	length() {
		return Math.sqrt(this.x.value ** 2 + this.y.value ** 2)
	}

	negate() {
		return new EvalVector(this.x.negate(), this.y.negate())
	}

	abs() {
		return new EvalNumber(this.length())
	}

	add(rhs: EvalValue) {
		if (rhs.type !== 'Vector') throw this.rhsValueError('+', rhs)
		return new EvalVector(this.x.add(rhs.x), this.y.add(rhs.y))
	}

	substract(rhs: EvalValue) {
		if (rhs.type !== 'Vector') throw this.rhsValueError('-', rhs)
		return new EvalVector(this.x.substract(rhs.x), this.y.substract(rhs.y))
	}

	multiply(rhs: EvalValue) {
		if (rhs.type !== 'Vector') throw this.rhsValueError('*', rhs)
		return new EvalNumber(
			cos(this.angel() - rhs.angel()) * this.length() * rhs.length(),
		)
	}

	toString() {
		return `{${this.x.toString()}, ${this.y.toString()}}`
	}
}
