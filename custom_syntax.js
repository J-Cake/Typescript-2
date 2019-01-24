'use strict';

const {
	minify
} = require('uglify-es');
const beautify = require('js-beautify').js;
const fs = require('fs');
const detectIndent = require('detect-indent');

// Array.prototype.peek = function () {
// 	return this[this.length - 1];
// };
// String.prototype.peek = function () {
// 	return this[this.length - 1];
// };

const reservedWords = "string boolean number object undefined null for while do break continue try catch finally return if else switch case return class static async await import export default from as of in yield".split(' ');

const compile = code => {
	let output = ""; //  + fs.readFileSync('./prerequisites.js').toString()
	// let output = "initial";

	code = code + "\n";

	const indentChar = detectIndent(code).indent || "    ";

	output += compilationStep(code, indentChar);

	return fs.readFileSync('./var_class.js').toString() + '\n' + beautify(`${output}`);
};

const compilationStep = (code, indentChar) => {
	let output = "";

	const split = code.split(/[\n\r]/).filter(i => i !== "");

	// split.forEach((i, a) => {
	for (let a = 0; a < split.length; a++) {
		let i = split[a];
		i = i.trimRight();

		const level = count(i, indentChar);

		const regex = /^([a-zA-Z$_][a-zA-Z$_0-9]*) +([a-zA-Z$_][a-zA-Z$_0-9]*)(?: *= *(.[^ ].+))?$/;
		let [type, name, value] = (i.match(regex) || []).slice(1);

		if (regex.test(i) && type !== "typeof") {
			const regex = /^\( *([a-zA-Z$_][a-zA-Z$_0-9]* [a-zA-Z$_][a-zA-Z$_0-9]*)? *(?: *, *([a-zA-Z$_][a-zA-Z$_0-9]* [a-zA-Z$_][a-zA-Z$_0-9]*))*\)(?:>)$/; // regex tests for function expression
			if (regex.test(value)) {
				const [...args] = (value.match(regex) || []).slice(1).filter(i => i || "");

				const body = getCurrentBody(a, level, split, indentChar);

				value = `function (${args.map(i => i.split(' ')[1]).join(', ')}) {
					return (function ([${args.map(i => i.split(' ')[1]).join(', ')}]) {
						${compilationStep(body)}
					})([...variable.transpileAll([${args.map(i => ` {type: "${i.split(' ')[0]}", value: ${i.split(' ')[1]}}`)} ])]);
				}`;
				a += (body.match(/\n/g) || []).length;
				// console.log(value)
			}
			output += `\n const ${name} = new variable("${type}", ${value});`;
			if (name === "start")
				output += "start.call();";
		} else if (type === "typeof") {
			output += (`\n${name}.setType(${value});`);
		} else {
			console.log(i, "\n");
			i = i.replace(/^\s*</, `${new Array(level).fill(indentChar)}return`);
			// console.log(i);

			const vars = i.replace(/".*?"/g, '').split(/[^a-zA-Z0-9$_)]/g).filter(i => /^[a-zA-Z$_][a-zA-Z0-9$_]*$/.test(i)).filter(j => !reservedWords.includes(j));

			console.log(vars);

			// let lastIndex = 0;
			// vars.forEach(j => {
			// 	const newI = [...i];
			// 	const a = i.indexOf(j, lastIndex);
			// 	const newString = `(variable.getInstance(${j}))`;
			// 	newI.splice(a, j.length, newString);
			// 	lastIndex = a + newString.length;
			// 	i = newI.join('');
			// });
			//
			// console.log(i);

			output += i;
		}

	}

	return output;
};

const count = (input, charToCount) => {
	let total = 0;
	const split = [...input];

	while (split.shift() === charToCount)
		total++;

	return total;
};

function getCurrentBody(startIndex, offsetLevel, code, indentChar) {
	let output = "";

	// console.log(...arguments);

	for (let i = startIndex + 1; i < code.length; i++) {
		if (count(code[i], indentChar) >= offsetLevel + 1) {
			output += code[i] + ";\n";
		} else {
			break;
		}
	}

	// console.log("Body\n", "\b" + output, "\bEnd");
	// console.log('called');

	return output;
}

// console.log(minify(compile(fs.readFileSync(process.argv[2]).toString())).code);
// console.log(compile(fs.readFileSync(process.argv[2]).toString()));
// compile(fs.readFileSync(process.argv[2]).toString());
// fs.writeFileSync('output.js', minify(compile(fs.readFileSync(process.argv[2]).toString())).code);
fs.writeFileSync('output.js', compile(fs.readFileSync(process.argv[2]).toString()));
// eval(minify(compile(fs.readFileSync(process.argv[2]).toString())));