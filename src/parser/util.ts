import { Node } from '../types'
import { types as tt, TokenType } from '../tokenizer/types'
import { Options } from '../options'
import Tokenizer from '../tokenizer'

export default class UtilParser extends Tokenizer {
	options: Options;

	// @ts-ignore
	unexpected(
		error: string = 'unexpected token',
		showValue: boolean = true,
	) {
		const { filename } = this.options
		const {
			startLoc,
			value,
			type,
		} = this.state
		const position = `${startLoc.line}:${startLoc.column}`
		const prefix = showValue ? `'${value || type.label}'` : ''
		const padding = showValue ? ' ' : ''

		throw new SyntaxError(`at ${filename}, ${position} - ${prefix}${padding}${error}`)
	}

	expect(type: TokenType): void {
		if (!this.eat(type)) this.unexpected()
	}

	needMultiplierShortcut(prevNode: Node) {
		return (
			this.state.type.afterOp
			// TODO: recheck difference of && and || in the following line, original was ||
			&& (prevNode.type !== 'BinaryExpression' && prevNode.type !== 'UnaryExpression')
			&& !this.isLineTerminator()
		)
	}

	semicolon() {
		if (!this.eat(tt.semi) && !this.isLineTerminator()) this.unexpected()
	}

	isLineTerminator() {
		return (
			this.match(tt.semi)
			|| this.match(tt.eof)
			|| /\n/.test(this.state.input.slice(this.state.prevEnd, this.state.start))
		)
	}
}
