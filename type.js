class variable {
	constructor(value, type) {
		this.type = type;
		this.setVar = function(value) {
			if (typeof value === this.type || this.type === "any") {
				this.value = value;
			} else {
				throw new TypeError("Input datatype is not " + this.type);
			}
		};
		this.setVar(value);
	}
}

let var1 = new variable("12", "string");

var1.setVar("16");