# arithmetic-evaluator

Runs math expression through parser and then evaluate the value.

## Getting Started

for installing run
```
$ git clone https://github.com/itamar244/arithmetic-evaluator.git
$ npm install
```

some scripts are added for convenience
```
$ npm start
$ npm test
$ npm run build
```

get `master` branch for better supports or get `ast-parser` for faster and revisted parser ad evaluator.


## Features

- the following operators are legal: +, -, *, /, %, ^.

- numbers can be both integers, floating numbers and `Infinity`.

- the following functions are available:
	- cos (length: 1)
	- sin (length: 1)
	- tan (length: 1)
	- abs (length: 1)
	- log (length: 1)
	- floor (length: 1)
	- sqrt (length: 1)
	- max (length: as many as you want)

- constants can be used. they need to be in capital letters only.
	they are the same as the constants in Math object.

- parameters can be used too. just use lower-cased chars and for each char the program will ask for its value.

- also supports equations. just put one parameter in the equation and add `=` sign.

### Language Features

#### Import Statements

this statement will add file'S progmam to the top of the file
`import '<FILE_NAME>'`
`FILE_NAME` - relative path to the current filename


#### Function Statements

this statements creates a function reusable code
`func <NAME>(...PARAMS) <STATEMENT>`

`NAME` - the name of the function
`PARAMS` - list of parameters seperated by commas
`STATEMENT` - the statement to evaluate and return from the function
