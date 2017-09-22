$(() => {
    class InputChecker {
        constructor(validator, listener) {
            this.validator = validator;
            this.listener = listener;
        }
    }

    const setErrorMessage = (target, message) => {
        let label = $(`label[for="${target.id || target}"]`);
        let span = label.find('span');
        if (message) {
            if (span.html()) {
                span.html(' ' + message);
            }
            else {
                label.append(`<span> ${message}</span>`)
            }
        }
        else {
            span.remove();
        }
    };

    const NON_ALPHA_REGEX = /[^a-z]/gi;
    const NON_ALPHA_NUMERICAL_REGEX = /[^a-z0-9]/gi;
    const SSN_REGEX = /[^0-9-]/g;

    const alphaCheckListener = (event) => {
        let target = $(event.target);
        let oldStr = target.val();
        let newStr = oldStr.replace(NON_ALPHA_REGEX, '');
        target.val(newStr);
        setErrorMessage(event.target, (oldStr.length !== newStr.length ? 'Letters Only' : null));
    };

    const alphaValidator = (str) => !NON_ALPHA_REGEX.test(str);

    const employeeIdListener = (event) => {
        let target = $(event.target);
        let oldStr = target.val();
        let newStr = oldStr.replace(NON_ALPHA_NUMERICAL_REGEX, '');
        target.val(newStr.substr(0, 5));
        if (newStr.length > 5) {
            setErrorMessage(event.target, 'Max length is 5');
        }
        else if (oldStr.length !== newStr.length) {
            setErrorMessage(event.target, 'Letters or Numbers Only');
        }
        else {
            setErrorMessage(event.target);
        }
    };

    const employeeIdValidator = (str) => str.length < 6 && !NON_ALPHA_NUMERICAL_REGEX.test(str);

    const ssnListener = (event) => {
        let target = $(event.target);
        let oldStr = target.val();
        if (oldStr.length > 11) {
            target.val(oldStr.substring(0, 11));
            setErrorMessage(event.target, "Must be valid SSN format");
        }
        else {
            let newStr = oldStr.replace(SSN_REGEX, '');
            if (newStr.length === oldStr.length) {

                if (newStr.length > 3 && newStr.charAt(3) !== '-') {
                    newStr = newStr.substring(0, 3) + '-' + newStr.substring(3);
                }
                if (newStr.length > 6 && newStr.charAt(6) !== '-') {
                    newStr = newStr.substring(0, 6) + '-' + newStr.substring(6);
                }

                //Check for "illegal" hyphens
                let hyphenIndex = newStr.indexOf('-');
                let errMessage;
                while (hyphenIndex !== -1) {
                    if (hyphenIndex !== 3 && hyphenIndex !== 6) {
                        newStr = newStr.substring(0, hyphenIndex) + newStr.substring(hyphenIndex + 1);
                        errMessage = "Must be valid SSN format";
                    }
                    hyphenIndex = newStr.indexOf('-', hyphenIndex + 1);
                }

                setErrorMessage(event.target, errMessage);
            }
            else {
                setErrorMessage(event.target, "Must be valid SSN format");
            }
            target.val(newStr);
        }

    };

    const ssnValidator = (str) => {
        if (SSN_REGEX.test(str) || str.length !== 11)
            return false;

        let hyphens = str.match(/-/g);
        if (hyphens === null || hyphens.length !== 2)
            return false;

        return str.charAt(3) === '-' && str.charAt(6) === '-';
    };

    const dobValidator = (str) => typeof str === 'string' && !isNaN(Date.parse(str));

    const dobListener = (event) => setErrorMessage(event.target);

    const inputFunctions = {
        'first-name': new InputChecker(alphaValidator, alphaCheckListener),
        'last-name': new InputChecker(alphaValidator, alphaCheckListener),
        'employee-id': new InputChecker(employeeIdValidator, employeeIdListener),
        'dob': new InputChecker(dobValidator, dobListener),
        'ssn': new InputChecker(ssnValidator, ssnListener)
    };

    const formDiv = $('#form-div');

    formDiv.on('focusout', (event) => {
        setErrorMessage(event.target);
    });

    formDiv.on('input', (event) => {
        let inputObj = inputFunctions[event.target.id];
        if (inputObj.listener instanceof Function) {
            inputObj.listener(event);
        }
    });

    formDiv.on('submit', (event) => {
        let invalidFields = [];
        for (let key in inputFunctions) {
            let val = $('#' + key).val();
            if (val.length === 0 || !inputFunctions[key].validator(val)) {
                invalidFields.push(key);
            }
        }
        if (invalidFields.length > 0) {
            event.preventDefault();
            invalidFields.forEach((id) => setErrorMessage(id, "Invalid input"));
        }
    });
});