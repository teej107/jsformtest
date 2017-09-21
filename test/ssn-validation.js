let validateSSN = (str) => {
    if (/[^0-9-]/g.test(str) || str.length !== 11)
        return false;

    let hyphens = str.match(/-/g);
    if (hyphens === null || hyphens.length !== 2)
        return false;

    return str.charAt(3) === '-' && str.charAt(6) === '-';
};

console.assert(validateSSN("123-45-6789") === true);
console.assert(validateSSN("123456789") === false);
console.assert(validateSSN("123-a5-6789") === false);
console.assert(validateSSN("123-56") === false);

