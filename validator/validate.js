
/**
 * Registration and login validations happen here
 * these are run before user data actually reaches the database
 */

const joi = require("joi");

const userSchema = joi.object().keys({
    first_name: joi.string().required(),
    last_name: joi.string().required(),
    user_name: joi.string().alphanum().min(3).max(30).required(),
    nsu_id: joi.string().regex(/^[01][0-9][0-3]\d{4}(\d{3})?$/).required(),
    nsu_email: joi.string().email({ tldWhitelist: ["edu"] }).regex(/northsouth/).required(),
    alt_email: joi.string().email().required(),
    password: joi.string().alphanum().min(6).required(),
    re_password: joi.string().alphanum().min(6).required(),
});

const loginSchema = joi.object().keys({
    nsu_id: joi.string().regex(/^[01][0-9][0-3]\d{4}(\d{3})?$/).required(),
});

const validateRegForm = (req, res, next) => {

    const formInputErrorObj = {
        invalidName: false,
        invalidUserName: false,
        invalidNsuId: false,
        invalidNsuEmail: false,
        invalidAltEmail: false,
        invalidPasswd: false,
        passwdMisMatch: false,
    }

    const { ...userFormData } = req.body;

    let errorKey = null;

    const isValid = joi.validate(userFormData, userSchema);

    const flashRedirect = errorObj => {

        req.flash("info", errorObj);

        return res.redirect("/register");
    }

    if (isValid.error !== null) {

        errorKey = isValid.error.details[0].context.key;

    } else {

        next();
    }

    if (errorKey === "first_name" || errorKey === "last_name") {

        formInputErrorObj["invalidName"] = true;

        flashRedirect(formInputErrorObj);

    } else if (errorKey === "user_name") {

        formInputErrorObj["invalidUserName"] = true;

        flashRedirect(formInputErrorObj);

    } else if (errorKey === "nsu_id") {

        formInputErrorObj["invalidNsuId"] = true;

        flashRedirect(formInputErrorObj);

    } else if (errorKey === "nsu_email") {

        formInputErrorObj["invalidNsuEmail"] = true;

        flashRedirect(formInputErrorObj);

    } else if (errorKey === "alt_email") {

        formInputErrorObj["invalidAltEmail"] = true;

        flashRedirect(formInputErrorObj);

    } else if (errorKey === "password") {

        formInputErrorObj["invalidPasswd"] = true;

        flashRedirect(formInputErrorObj);

    } else if (userFormData.password !== userFormData.re_password) {

        formInputErrorObj["passwdMisMatch"] = true;

        flashRedirect(formInputErrorObj);
    }
}

const validateLogInForm = (req, res, next) => {

    const { nsu_id, _ } = req.body;

    const loginInputError = {
        invalidNsuId: false,
    }

    let errorKey = null;

    const isValid = joi.validate({ nsu_id }, loginSchema); // data has to be passed to JOI in object format

    if (isValid.error !== null) {

        errorKey = isValid.error.details[0].context.key;

    } else {

        next();
    }

    if (errorKey === "nsu_id") {

        loginInputError["invalidNsuId"] = true;

        req.flash("loginErr", loginInputError);

        return res.redirect("/login");

    }
}


module.exports = {
    validateRegForm,
    validateLogInForm,
}