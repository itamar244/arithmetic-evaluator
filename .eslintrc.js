module.exports = {
	'parser': 'babel-eslint',
		'env': {
			'shared-node-browser': true,
			'es6': true
		},
    'extends': 'airbnb-base',
    'plugins': [
        'import',
		'flowtype',
    ],
	'rules': {
		'semi': ['error', 'never'],
		'indent': [2, 'tab', { 'SwitchCase': 1 }],
		'no-tabs': [0],
		'no-use-before-define': [0],
		'no-restricted-syntax': [0],
		'no-param-reassign': [0],
		/* only because it used as if else with a clear syntax I created it's been silenced */
		'no-nested-ternary': [0],
		'no-mixed-operators': [0],
		// flow does this for me
		'no-undef': 0,
	}
}
