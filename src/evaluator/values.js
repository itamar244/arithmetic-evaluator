// @flow
import { cos } from './math'

type RhsHandler = (rhs: EvalValue) => EvalValue

interface ValueBase {
	toString(): string;
	abs(): EvalValue;
	negate(): EvalValue;
}

// polymorphic based class for EvalValue
export class Value {
	// all following fields should be implemented by subclasses
	+type: string;
	+add: RhsHandler;
	+substract: RhsHandler;
	+multiply: RhsHandler;
	+divide: RhsHandler;
	+pow: RhsHandler;
	+modulo: RhsHandler;

	unspportedOperator(operator: string) {
		return Error(`'${this.type}' doesn't support ${operator} operator`)
	}

	rhsValueError(operator: string, rhs: EvalValue) {
		return Error(`'${this.type}' didn't expected rhs of type '${rhs.type}' from operator ${operator}`)
	}

	abs() { throw this.unspportedOperator('abs') }
	negate() { throw this.unspportedOperator('-') }
	add() { throw this.unspportedOperator('+') }
	substract() { throw this.unspportedOperator('-') }
	multiply() { throw this.unspportedOperator('*') }
	divide() { throw this.unspportedOperator('/') }
	pow() { throw this.unspportedOperator('^') }
	modulo() { throw this.unspportedOperator('%') }
}

export type EvalValue =
	| EvalNull
	| EvalNumber
	| EvalVector

export class EvalNull extends Value implements ValueBase {
	+type: 'Null' = 'Null'

	// eslint-disable-next-line class-methods-use-this
	toString() { return 'null' }
}

export class EvalNumber extends Value implements ValueBase {
	+value: number
	+type: 'Number' = 'Number'

	constructor(value: number) {
		super()
		this.value = value
	}

	negate() {
		return new EvalNumber(-this.value)
	}

	abs() {
		return new EvalNumber(Math.abs(this.value))
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
		return new EvalNumber(this.value - rhs.value)
	}

	toString() {
		return this.value.toString(10)
	}
}

export class EvalVector extends Value implements ValueBase {
	+x: EvalNumber
	+y: EvalNumber
	+type: 'Vector' = 'Vector'

	constructor(x: EvalNumber, y: EvalNumber) {
		super()
		this.x = x
		this.y = y
	}

	angel() {
		return Math.atan2(this.y.value, this.x.value)
	}

	negate() {
		return new EvalVector(this.x.negate(), this.y.negate())
	}

	scale(scalar: EvalNumber) {
		return new EvalVector(this.x.multiply(scalar), this.y.multiply(scalar))
	}

	length() {
		return Math.sqrt(this.x.value ** 2 + this.y.value ** 2)
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
