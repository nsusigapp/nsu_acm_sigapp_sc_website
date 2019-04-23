const { sequelize, users: Users } = require("../models/index");

// fetch profile picture from DB;
const fetchProfilePicture = (req, res, next) => {

    if (res.locals.userInfo && res.locals.userInfo.loggedIn) {

        Users.findOne({
            attributes: ["avatar_url"],
            where: {
                u_id: res.locals.userInfo.sessionData.uid,
            }
        })
            .then(fetchedResponse => {

                req.app.locals.avatar_url = fetchedResponse.avatar_url;

                next();
            })
            .catch(err => console.log(err));
    } else {

        next();
    }

}

module.exports = {
    fetchProfilePicture,
}