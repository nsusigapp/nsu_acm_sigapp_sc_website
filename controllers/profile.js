
const joi = require("joi");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const { users: User, sequelize } = require("../models/index");

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

const changePassword = (req, res, next) => {

    const { loggedIn } = res.locals.userInfo;
    const uid = loggedIn ? res.locals.userInfo.sessionData.uid : null;

    const { old_password, new_password, re_password } = req.body;
    
    sequelize.transaction()
    .then(t => {

        return User.findOne({
            where: {
                u_id: uid
            }
        }, { lock: t.LOCK.UPDATE, transaction: t })
            .then(fetchedUser => {

                if (!fetchedUser) {

                    return res.json({
                        userExists: false
                    });
    
                } else {
    
                    bcrypt.compare(old_password, fetchedUser.password)
                        .then(checkPass => {
    
                            if (!checkPass) {

                                return res.json({
                                    oldPass: false
                                });
    
                            } else {
    
                                if (new_password !== re_password) {
                                    
                                    return res.json({
                                        passMatch: false
                                    });
    
                                } else {
    
                                    bcrypt.hash(new_password, saltRounds)
                                        .then(hash => {
    
                                            const token = User.generateAuthToken({
                                                nsu_id: fetchedUser.nsu_id,
                                                role_id: fetchedUser.role_id,
                                                status: fetchedUser.status,
                                            });
    
                                            fetchedUser.password = hash;
                                            fetchedUser.token = token;

                                            return fetchedUser.save({
                                                transaction:  t
                                            })
                                                .then(saved => {

                                                    t.commit();

                                                    return res.json({
                                                        success: true
                                                    });
                                                })
                                                .catch(err => {
                                                    t.rollback()
                                                    console.log(err)
                                                });
                                        })
                                        .catch(err => {
                                            t.rollback()
                                            console.log(err)
                                        });
                                }
                            }
    
                        })
                        .catch(err => {
                            t.rollback()
                            console.log(err)
                        });
                }
    
            })
            .catch(err => {
                t.rollback()
                console.log(err)
            });
    });
}

module.exports = {
    updateSettings,
    changePassword
}