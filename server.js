// @flow
import { parse } from './src/parser'
import { evaluate, evaluateEquation } from './src/evaluator'
import express from 'express'

let app = express();

app.listen(8080, (err) => console.log('server has started on port: 8080'))

app.get('/', (req: express$Request, res) => {
	let result = parse((req.query.answer || '').replace(/"/g, ''))

	switch (result.type) {
		case 'ERROR':
			res.end(result.body)
			break
		case 'EQUATION':
			res.end(evaluateEquation(result.body, result.params[0]).toString())
			break
		case 'EXPRESSION':
			res.end(evaluate(result.body).toString())
			break
	}
})
