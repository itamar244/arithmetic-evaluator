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
$ npm build
```

get `master` branch for better supports or get `ast-parser` for faster and revisted parser ad evaluator.


## Features

- the following operators are legal: + - * / %.

- numbers can be both integers, floating numbers and `Infinity`.

- the following functions are available:
	- cos (length - 1)
	- sin (length - 1)
	- tan (length - 1)
	- abs (length - 1)
	- log (length - 1)
	- floor (length - 1)
	- sqrt (length - 1)
	- max (length - many as you want)

- constants can be used. they need to be in capital letters only.
	they are the same as the constants in math.

- params can be used too. just use lower-cased chars and for each char the program will ask for its value.

- the `master` branch supports equations. just put one paremeter in the equation and add `=` sign.
