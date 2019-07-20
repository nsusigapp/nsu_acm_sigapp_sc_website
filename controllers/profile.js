
const joi = require("joi");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const { cookieOpt } = require("../utils/constants");
const { sessStatus } = require("../utils/userConst");

const { users: User, session: Session, sequelize } = require("../models/index");

const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const store = new RedisStore();

const updateSettings = async (req, res, next) => {

    const emailVerify = joi.object().keys({
        alt_email: joi.string().email().required(),
    });

    const { alt_email, avatar_url, github_link, u_id } = req.body;
    const uid = parseInt(u_id);

    const isValid = joi.validate({ alt_email }, emailVerify);

    if (isValid.error !== null) {

        return res.json({
            invalidEmail: true,
        });

    } else {

        try {
            
            await User.update({
                alt_email,
                avatar_url,
                github_link
            }, {
                    where: {
                        u_id: uid
                    }
            });
                
            return res.json({
                success: true
            });

        } catch (err) {

            console.log(err);
        }

    }
}

const matchPassword = (req, res, next) => {

    const { new_password, re_password } = req.body;

    if (new_password !== re_password) {

        return res.json({
            passMatch: false
        });

    }
        
    return next();
}

const adminChangePassword = async (req, res, next) => {

    const { new_password, u_id } = req.body;

    const { isAdmin } = res.locals.userInfo;
    const uid = parseInt(u_id);

    if (!isAdmin) {

        return next();
    }

    try {
        
        const fetchedUser = await User.findOne({
            where: {
                u_id: uid
            }
        });
                
        if (!fetchedUser) {
        
            return res.json({
                userExists: false
            });
        }
                    
        const hash = await bcrypt.hash(new_password, saltRounds);
        
        const token = User.generateAuthToken({
            nsu_id: fetchedUser.nsu_id,
            role_id: fetchedUser.role_id,
            status: fetchedUser.status,
        });
        
        await sequelize.transaction(async function(t) {
        
            fetchedUser.password = hash;
            fetchedUser.token = token;
    
            await fetchedUser.save({
                transaction: t,
                lock: t.LOCK.UPDATE
            });
        
            const fetchedSess = await Session.findAll({
                where: {
                    u_id: uid,
                    sess_status: sessStatus.ACTIVE
                }
            }, { transaction: t });
        
            await Promise.all(fetchedSess.map(sess => {
        
                store.destroy(sess.sess_id, err => {
        
                    if (err) {
        
                        console.log(err);
        
                    } else {
                                                            
                        sess.sess_status = sessStatus.EXPIRED;
                        return sess.save();
                    }
                });
    
            }));
                                                    
            return res.json({
                success: true,
            });
        });
        
    } catch (err) {

        console.log(err);
    }
        
    
}

const userChangePassword = async (req, res, next) => {

    const { old_password, new_password, u_id } = req.body;
    const uid = parseInt(u_id);

    try {
        
        const fetchedUser = await User.findOne({
            where: {
                u_id: uid
            }
        });
    
        if (!fetchedUser) {
    
            return res.json({
                userExists: false
            });
        }
    
        const checkPass = await bcrypt.compare(old_password, fetchedUser.password);
    
        if (!checkPass) {
    
            return res.json({
                oldPass: false
            });
        }
    
        const hash = await bcrypt.hash(new_password, saltRounds);      
    
        const token = User.generateAuthToken({
            nsu_id: fetchedUser.nsu_id,
            role_id: fetchedUser.role_id,
            status: fetchedUser.status,
        });
    
        await sequelize.transaction(async function(t) {
    
            fetchedUser.password = hash;
            fetchedUser.token = token;
    
            await fetchedUser.save({
                transaction: t,
                lock: t.LOCK.UPDATE
            });
    
            const fetchedSess = await Session.findAll({
                where: {
                    u_id: uid,
                    sess_status: sessStatus.ACTIVE
                }
            }, { transaction: t });
            
            await Promise.all(fetchedSess.map(sess => {
            
                store.destroy(sess.sess_id, err => {
            
                    if (err) {
            
                        console.log(err);
            
                    } else {
                                                                
                        sess.sess_status = sessStatus.EXPIRED;
                        return sess.save();
                    }
                });
        
            }));
            
            return res.json({
                success: true,
            });
        });

    } catch (err) {
        
        console.log(err);
    }                                               
}

module.exports = {
    updateSettings,
    matchPassword,
    adminChangePassword,
    userChangePassword
}