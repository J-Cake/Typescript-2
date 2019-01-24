const {
	minify
} = require('uglify-es');
const fs = require('fs');
const compile = code => {

	code = formatCode(code);

	let output = [];
	let vars = [];

	const keywords = "string number object function typeof instanceof const let var break case switch return default import export class constructor throw try catch finally new for while do private public static async await of in debugger".split(" ");

	const split = filterFunctions(code.split(/[ \r\n;]/g));

	let skipNext = 0;

	for (let b in split) {
		let a = Number(b);

		const i = split[a];
		// console.log(a, i);
		if (skipNext) {
			skipNext--;
		}

		const newVar = () => {
			output.push(`${split[a]} = new variable(${getDataType(split[a - 1])}, ${split[a + 2].replace(';', '')});`); //output[output.length - 1],

			vars.push(split[a - 1]);
			skipNext = 3;
		};

		if (skipNext === 0) {
			if (!keywords.includes(i) && /^[$_a-zA-Z][$_a-zA-Z0-9]*(?=;?)$/.test(i)) { // var is referenced
				if ("any string number function object".split(" ").includes(output[output.length - 1])) { // var is declared
					// console.log(output)
					newVar();
				} else {
					if (vars.includes(i)) { // referenced var was not defined by user
						output.push(i);
						// console.log(output);
					} else { // referenced var was defined by user
						if (split[a + 1] === "=") {
							output.push(i + `.setVar(${split[a + 2]})`);
							skipNext = 3;
							// console.log(output);
						} else {
							output.push(i + ".value");
							// console.log(output);
						}
					}
				}
			} else {
				output.push(filterVarKeywords(i));
				// console.log(output)
			}
		} else {
			// continue;
		}
	}
	return `${fs.readFileSync('var_class.js')}\n${output.join(' ')}`;
	// return output.join(' ');
};

function getDataType(string) {
	const types = "any string function object number".split(" ");
	if (types.includes(string)) {
		return "\"" + string + "\"";
	} else {
		return "undefined";
	}
}

function filterVarKeywords(string) {
	if ("string function object number".split(" ").includes(string)) return "let";
	else return string;
}

function formatCode(code) {
	let output = "";
	for (let i of code) {
		switch (i) {
			case "(":
			case "{":
			case "[":
			case ")":
			case "]":
			case "}":
				output += " " + i + " ";
				break;
			default:
				output += i;
		}
	}
	return output;
}

function filterFunctions(split) {
	const returned = [];
	let funcStarted = false;
	let funcCont = "";
	let bracketCount = 0;

	split.forEach(i => {
		if (i === "function")
			funcStarted = true;
		if (funcStarted) {
			if (i === "{") bracketCount++;
			if (i === "}") {
				bracketCount--;
				if (bracketCount === 0) {
					funcStarted = false;
					returned.push(funcCont + "}");
					funcCont = "";
				}
			}
			funcCont += " " + i;

		} else {
			returned.push(i);
		}
	});

	return returned;
}

eval(minify(compile(fs.readFileSync("demo_script.txt").toString()).replace(/ {3}/g, ';')).code);
// console.log(minify(compile(fs.readFileSync("demo_script.txt").toString()).replace(/ {3}/g, ';')).code);
// console.log(compile(fs.readFileSync("demo_script.txt").toString()).replace(/ {3}/g, ';'))