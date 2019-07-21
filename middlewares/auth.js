
const jwt = require("jsonwebtoken");

const { roleID } = require("../utils/userConst");

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

module.exports = {
    isLoggedIn,
}