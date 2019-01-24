'use strict';
class variable {
	constructor(type, value, isConstant) {
		this.isConstant = isConstant || false;
		this.isFunction = false;
		this.assigned = false;
		this.type = type;
		this.setVar = function(value) {
			if (!this.isConstant || !this.assigned) {
				if (typeof value === this.type || value.constructor.name === this.type || this.type === "any" || typeof value === "function") {
					this.value = value;
					this.isFunction = typeof this.value === "function";
					this.assigned = true;
				} else {
					variable.invalidTypeError(this.type);
				}
			} else {
				throw new TypeError("Assignment to constant variable");
			}
		};
		this.setVar(value);
	}
	getType() {
		return this.type;
	}
	setType(type) {
		this.type = type;
		console.warn("Warning: Changing types is not a good idea");
	}
	call(...args) {
		const output = this.value(...args);
		if (variable.compare(this.type, typeof output))
			variable.invalidTypeError(this.type);
		else
			return output;
	}
	static transpileAll(vars) {
		return vars.map(i => new variable(i.type, i.value));
	}
	static getInstance(object) {
		if (object instanceof variable) {
			return object.value;
		} else {
			return object;
		}
	}

	static invalidTypeError(type) {
		throw new TypeError("Input datatype is not " + type);
	}

	static compare(staticType, inputType) {
		let output = false;
		if ((staticType === "void" && inputType === "undefined") || (staticType === "void" && inputType === "null") || (staticType === inputType))
			output = true;
		return output;
	}
}

const undef = new variable("void", undefined);
if (void undef.getType())
	console.log(undef.setType("void") && variable.transpileAll([]) && variable.getInstance(undef)); // just to get the IDE to shut up.