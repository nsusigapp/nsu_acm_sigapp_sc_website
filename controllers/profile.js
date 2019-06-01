
const joi = require("joi");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const { cookieOpt } = require("../utils/constants");
const { sessStatus } = require("../utils/userConst");


const { users: User, session: Session, sequelize } = require("../models/index");

const Op = sequelize.Op;

const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const store = new RedisStore();

const updateSettings = (req, res, next) => {

    const emailVerify = joi.object().keys({
        alt_email: joi.string().email().required(),
    });

    const { alt_email, avatar_url, github_link, u_id } = req.body;
    const { loggedIn, sessionData, isAdmin } = res.locals.userInfo;
    const uid = loggedIn ? parseInt(u_id) : null;
    const actionAllowed = uid === sessionData.uid || isAdmin ? true : false;
    
    if (!actionAllowed) {

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

    const { old_password, new_password, re_password, u_id } = req.body;

    const { loggedIn, sessionData, isAdmin } = res.locals.userInfo;
    const uid = loggedIn ? parseInt(u_id) : null;
    const actionAllowed = uid === sessionData.uid || isAdmin ? true : false;
    
    if (!actionAllowed) {

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

                                            Session.findAll({
                                                where: {
                                                    u_id: uid,
                                                    sess_status: sessStatus.ACTIVE
                                                }
                                            })
                                                .then(fetchedSess => {

                                                    return Promise.all(fetchedSess.map(sess => {

                                                        store.destroy(sess.sess_id, err => {

                                                            if (err) {
                                                                
                                                                console.log(err);
    
                                                            } else {

                                                                sess.sess_status = sessStatus.EXPIRED;
                                                                return sess.save();
                                                            }
                                                        });
                                                    }))
                                                        .then(allSess => {
                                                                                             
                                                            return res.json({
                                                                success: true,
                                                            });
                                                        })
                                                        .catch(err => console.log(err));
                                                })
                                                .catch(err => console.log(err));
                                        })
                                })
                                .catch(err => console.log(err));

                        })
                        .catch(err => console.log(err));
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