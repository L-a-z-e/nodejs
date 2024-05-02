const calc = require('chapter4/sample-package');

const a = 5;
const b = 3;

console.log("a + b = ", calc.add(a,b));
console.log("a - b = ", calc.sub(a,b));
console.log("a * b = ", calc.multi(a,b));
console.log("a / b = ", calc.div(a,b));