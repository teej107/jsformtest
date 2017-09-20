$(() => {
    let setErrorMessage = (target, message) => {
        let label = $(`label[for="${target.id}"]`);
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

    let replaceNonAlpha = (text) => {
        return text.replace(/[^a-z]/gi, '');
    };

    let replaceNonNumeric = (text) => {
        return text.replace(/[^0-9]/g, '');
    };

    let replaceNonAlphaNumeric = (text) => {
        return text.replace(/[^a-z0-9]/gi, '');
    };

    let alphaCheckListener = (event) => {
        let target = $(event.target);
        let oldStr = target.val();
        let newStr = replaceNonAlpha(oldStr);
        target.val(newStr);
        setErrorMessage(event.target, (oldStr.length !== newStr.length ? 'Letters Only' : ''));
    };

    let employeeIdListener = (event) => {
        let target = $(event.target);
        let oldStr = target.val();
        let newStr = replaceNonAlphaNumeric(oldStr);
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

    let ssnListener = (event) => {
        let target = $(event.target);
        let oldStr = target.val().replace('-', '');
        let newStr = replaceNonNumeric(oldStr);
        if (newStr.length > 9) {
            newStr = newStr.substring(0, 9);
            setErrorMessage(event.target, "Must be valid SSN format");
        }
        else if (oldStr.length !== newStr.length) {
            setErrorMessage(event.target, 'Numbers Only');
        }
        else {
            setErrorMessage(event.target);
        }
/*        if (newStr.length > 3) {
            newStr = newStr.substring(0, 3) + '-' + newStr.substring(3);
        }
        if (newStr.length > 6) {
            newStr = newStr.substring(0, 6) + '-' + newStr.substring(6);
        }*/
        target.val(newStr);
    };

    let inputFunctions = {
        'first-name': alphaCheckListener,
        'last-name': alphaCheckListener,
        'employee-id': employeeIdListener,
        'dob': null,
        'ssn': ssnListener
    };

    $('#form-div').on('focusout', (event) => {
        setErrorMessage(event.target);
    });

    $('#form-div').on('input', (event) => {
        let inputFn = inputFunctions[event.target.id];
        if (inputFn instanceof Function) {
            inputFn(event);
        }
    });
});