const { sequelize, users: Users, categories: Category, quotes: Quote } = require("../models/index");

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

const fetchRandomQuote = (req, res, next) => {

    const failedToFetchQuote = "Error 404, Quote not found :')";

    Quote.findAll({
        attributes: ["quote_text"]
    })
        .then(fetchedQuotes => {

            const min = 0;
            const max = fetchedQuotes.length - 1;

            const randomQuote = fetchedQuotes[Math.floor(Math.random() * (max - min + 1) + min)];

            req.randomQuote = randomQuote.quote_text;

            next();
        })
        .catch(err => {

            console.log(err);

            req.randomQuote = failedToFetchQuote;

            next();
            
        });
}

module.exports = {
    fetchProfilePicture,
    fetchForumCategories,
    fetchRandomQuote
}