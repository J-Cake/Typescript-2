class variable {
	constructor(type, value) {
		this.type = type;
		this.setVar = function(value) {
			if (typeof value === this.type || this.type === "any" || typeof value === "function") {
				this.value = value;
			} else {
				throw new TypeError("Input datatype is not " + this.type);
			}
		};
		this.setVar(value);
	}
	getType() {
		return this.type;
	}
}