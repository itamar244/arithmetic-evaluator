module.exports = {
	'parser': 'babel-eslint',
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
		/* only because it used as if else with a clear syntax I created it's been silenced */
		'no-nested-ternary': [0],
		'no-mixed-operators': [0],
	}
}
