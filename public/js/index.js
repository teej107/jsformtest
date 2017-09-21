$(() => {
    class InputChecker {
        constructor(validator, listener) {
            this.validator = validator;
            this.listener = listener;
        }
    }

    let getLabelFor = (target) => $(`label[for="${target.id || target}"]`);

    let setErrorMessage = (target, message) => {
        let label = getLabelFor(target);
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

    let alphaCheckListener = (event) => {
        let target = $(event.target);
        let oldStr = target.val();
        let newStr = oldStr.replace(NON_ALPHA_REGEX, '');
        target.val(newStr);
        setErrorMessage(event.target, (oldStr.length !== newStr.length ? 'Letters Only' : null));
    };

    let alphaValidator = (str) => !NON_ALPHA_REGEX.test(str);

    let employeeIdListener = (event) => {
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

    let employeeIdValidator = (str) => str.length < 6 && !NON_ALPHA_NUMERICAL_REGEX.test(str);

    let ssnListener = (event) => {
        let target = $(event.target);
        let oldStr = target.val();
        if (oldStr.length >= 11) {
            target.val(oldStr.substring(0, 11));
            setErrorMessage(event.target, (validateSSN(oldStr) ? null : "Must be valid SSN format"));
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

                //TODO: Check for "illegal" hyphens

                setErrorMessage(event.target);
            }
            else {
                setErrorMessage(event.target, "Must be valid SSN format");
            }
            target.val(newStr);
        }

    };

    let validateSSN = (str) => {
        if (SSN_REGEX.test(str) || str.length !== 11)
            return false;

        let hyphens = str.match(/-/g);
        if (hyphens === null || hyphens.length !== 2)
            return false;

        return str.charAt(3) === '-' && str.charAt(6) === '-';
    };

    let inputFunctions = {
        'first-name': new InputChecker(alphaValidator, alphaCheckListener),
        'last-name': new InputChecker(alphaValidator, alphaCheckListener),
        'employee-id': new InputChecker(employeeIdValidator, employeeIdListener),
        'dob': new InputChecker((str) => typeof str === 'string' && !isNaN(Date.parse(str))),
        'ssn': new InputChecker(validateSSN, ssnListener)
    };

    let formDiv = $('#form-div');

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
            let target = $('#' + key);
            if (target.val().length === 0 || !inputFunctions[key].validator(target.val())) {
                invalidFields.push(getLabelFor(key).html());
            }
        }
        if (invalidFields.length > 0) {
            event.preventDefault();
            alert("The following fields have invalid values:\n" + invalidFields.join('\n'));
        }
    });
});