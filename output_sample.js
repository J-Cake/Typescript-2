class variable{constructor(type,value){this.type=type;this.setVar(value);}setVar(value){if(typeof value===this.type||this.type==="any"){this.value=value;}else{throw new TypeError("Input datatype is not "+this.type);}}getVar(){return this.value;}}
let x = new variable("any", 10); console.log( x.getVar() + 3 )
