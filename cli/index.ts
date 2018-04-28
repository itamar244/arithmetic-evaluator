// @flow
import yargs, { argv } from 'yargs'

import {
	runRepl,
	runWithFileGiven,
} from './run'

yargs
	// @ts-ignore
	.version('0.0.1')
	.usage('[file]')
	.option('benchmark', {
		type: 'boolean',
		describe: 'benchmark the speed of parsing and running',
	})
	.option('tree', {
		alias: 't',
		type: 'boolean',
		describe: 'print the output program in JSON',
	})

if (argv._[0] != null) {
	runWithFileGiven(argv._[0], argv)
} else {
	runRepl(argv)
}
