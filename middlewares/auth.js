
const jwt = require("jsonwebtoken");

const { roleID } = require("../utils/userConst");

const { users: User, Sequelize } = require("../models/index");

const Op = Sequelize.Op;

const isLoggedIn = (req, res, next) => {

    if (req.session.userData && req.cookies["_pass"]) {

        try {
            
            const decodeToken = jwt.verify(req.cookies["_pass"], process.env.JWT_SECRET);

            const isAdmin = decodeToken.role_id === roleID.ADMIN && req.session.userData.role_id === decodeToken.role_id;

            res.locals.userInfo = {
                sessionData: req.session.userData,
                loggedIn: true,
                role_id: decodeToken.role_id,
                isAdmin: isAdmin
            }

            return next();

        } catch (err) {

            console.log(err);
            
            res.locals.userInfo = {
                loggedIn: false,
            }

            return next();
        }

    }

    res.locals.userInfo = {
        loggedIn: false,
    }

    return next();
}

const doesUserExist = async (req, res, next) => {

    const { re_password, ...userDbData } = req.body;

    try {
        
        const user = await User.findOne({
            where: {
                [Op.or]: [{
                    user_name: userDbData.user_name,
                }, {
                    nsu_id: userDbData.nsu_id
                }, {
                    nsu_email: userDbData.nsu_email
                }],
            },
            raw: true,
        });

        if (user === null) {
            return next();
        }
        
        // roll back if error occurs
        const dbFetchErrorObj = {
            userNameExists: false,
            emailExists: false,
            nsuIdExists: false,
        }
        
        req.flash("formdata", userDbData);
        
        if (user.nsu_id === userDbData.nsu_id) {
        
            dbFetchErrorObj["nsuIdExists"] = true;
        
            req.flash("info", dbFetchErrorObj);
        
            return res.redirect("/register");
        
        } else if (user.nsu_email === userDbData.nsu_email) {
            
            dbFetchErrorObj["emailExists"] = true;
        
            req.flash("info", dbFetchErrorObj);
        
            return res.redirect("/register");
        
        } else if (user.user_name.toLowerCase() === userDbData.user_name.toLowerCase()) {

            dbFetchErrorObj["userNameExists"] = true;
        
            req.flash("info", dbFetchErrorObj);
        
            return res.redirect("/register");
        }

    } catch (err) {
        
        console.log(err);
    }
}

module.exports = {
    isLoggedIn,
    doesUserExist
}