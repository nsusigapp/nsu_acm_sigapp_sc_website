
const joi = require("joi");

const { users: User } = require("../models/index");

const updateSettings = (req, res, next) => {

    const emailVerify = joi.object().keys({
        alt_email: joi.string().email().required(),
    });

    const isValid = joi.valid(req.body.alt_email, emailVerify);

    if (isValid.error !== null) {

        return res.json({
            email: false,
        });
    }
}

module.exports = {
    updateSettings
}