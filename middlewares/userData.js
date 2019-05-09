const { sequelize, users: Users, categories: Category } = require("../models/index");

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

const fetchForumCategories = (req, res, next) => {

    Category.findAll({
        attributes: ["cat_name"]
    })
        .then(fetchedCat => {

            res.locals.categories = fetchedCat;

            next();
        })
        .catch(err => console.log(err));
}

module.exports = {
    fetchProfilePicture,
    fetchForumCategories
}