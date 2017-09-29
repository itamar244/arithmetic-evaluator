// @flow
import commander from 'commander'

import {
	runRepl,
	runWithFileGiven,
} from './run'

commander
	.version('0.0.1')
	.arguments('<type> [file]')
	.option('--benchmark', 'benchmark the speed of parsing and running')
	.option('-t, --tree', 'print the output program in JSON')
	.action((cmd, file, options) => {
		if (cmd === 'run') {
			runWithFileGiven(file, options)
		} else if (cmd === 'repl') {
			runRepl()
		}
	})

commander.parse(process.argv)
