let dateValidator = (str) => typeof str === 'string' && !isNaN(Date.parse(str));

console.assert(dateValidator("mm/dd/yyyy") === false);
console.assert(dateValidator("10/07/1994") === true);
console.assert(dateValidator(10989021) === false);
console.assert(dateValidator("13/32/1") === false);
console.assert(dateValidator("1970/1/1") === true);
