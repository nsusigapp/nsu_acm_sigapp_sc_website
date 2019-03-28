
const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {

    if (req.session.userData && req.cookies["_pass"]) {

        try {
            const decodeToken = jwt.verify(req.cookies["_pass"], process.env.JWT_SECRET);

            res.locals.userInfo = {
                sessionData: req.session.userData,
                loggedIn: true,
                roleId: decodeToken.role_id,
            }

            next();

        } catch (err) {

            console.log(err);
            
            res.locals.userInfo = {
                loggedIn: false,
            }

            next();
        }

    } else {

        res.locals.userInfo = {
            loggedIn: false,
        }

        next();
    }

}

module.exports = {
    isLoggedIn,
}