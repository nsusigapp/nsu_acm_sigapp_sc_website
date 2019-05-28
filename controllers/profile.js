
const joi = require("joi");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const { cookieOpt } = require("../utils/constants");
const { roleID } = require("../utils/userConst");

const { users: User, sequelize } = require("../models/index");

const updateSettings = (req, res, next) => {

    const emailVerify = joi.object().keys({
        alt_email: joi.string().email().required(),
    });

    const { alt_email, avatar_url, github_link, u_id } = req.body;
    const { loggedIn, sessionData, isAdmin } = res.locals.userInfo;
    const uid = loggedIn ? parseInt(u_id) : null;
    const actionAllowed = uid === sessionData.uid || isAdmin ? true : false;

    if (!loggedIn) {

        return res.json({
            notLoggedIn: true,
        });

    } else if (!actionAllowed) {

        return res.json({
            unauthorized: true,
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

    const { loggedIn, sessionData } = res.locals.userInfo;
    const uid = loggedIn ? parseInt(u_id) : null;
    const actionAllowed = uid === sessionData.uid || isAdmin ? true : false;

    const { old_password, new_password, re_password, u_id } = req.body;

    if (!loggedIn) {

        return res.json({
            notLoggedIn: true,
        });

    } else if (!actionAllowed) {

        return res.json({
            unauthorized: true,
        });
        
    } else {

        User.findOne({
            where: {
                u_id: uid
            }
        })
            .then(fetchedUser => {
    
                if (!fetchedUser) {
    
                    return res.json({
                        userExists: false
                    });
    
                } else if (isAdmin) {

                    if (new_password !== re_password) {
                                    
                        return res.json({
                            passMatch: false
                        });

                    } else {
                        
                    }

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
                                            
                                            sequelize.transaction(function(t) {
                                                
                                                fetchedUser.password = hash;
                                                fetchedUser.token = token;
                                                
                                                return fetchedUser.save({
                                                    transaction:  t,
                                                    lock: t.LOCK.UPDATE
                                                })
                                                    .then(saved => {
    
                                                        res.cookie("_pass", token, cookieOpt);
        
                                                        return res.json({
                                                            success: true,
                                                        });
                                                    })
                                            })
                                            .catch(err => console.log(err));
    
                                        })
                                        .catch(err => console.log(err));
                                }
                            }
    
                        })
                        .catch(err => console.log(err));
                }
    
            })
            .catch(err => console.log(err));
    }
    
}

module.exports = {
    updateSettings,
    changePassword
}