
const joi = require("joi");

const { users: User } = require("../models/index");

const updateSettings = (req, res, next) => {

    const emailVerify = joi.object().keys({
        alt_email: joi.string().email().required(),
    });

    const { alt_email, avatar_url, github_link } = req.body;
    const { loggedIn } = res.locals.userInfo;
    const uid = loggedIn ? res.locals.userInfo.sessionData.uid : null;

    if (!loggedIn) {

        return res.json({
            notLoggedIn: true,
        });

    } else {

        const isValid = joi.validate({ alt_email }, emailVerify);

        if (isValid.error !== null) {
    
            return res.json({
                invalidEmail: true,
            });
    
        } else {
    
            User.update({
                alt_email,
                avatar_url,
                github_link
            }, {
                where: {
                    u_id: uid
                }
            })
                .then(updateRes => {

                    return res.json({
                        success: true
                    });

                })
                .catch(err => console.log(err));
        }
    }

}

module.exports = {
    updateSettings
}