const { sequelize, Sequelize, users: User, quotes: Quote, 
        forum: Forum, blog: Blog, forum_answer: ForumAnswer } = require("../models/index");

// fetch profile picture from DB;
const fetchNavBarInfo = (req, res, next) => {

    if (res.locals.userInfo && res.locals.userInfo.loggedIn) {

        User.findOne({
            attributes: ["avatar_url","first_name"],
            where: {
                u_id: res.locals.userInfo.sessionData.uid,
            }
        })
            .then(fetchedResponse => {

                req.app.locals.headerInfo = fetchedResponse;

                return next();
            })
            .catch(err => console.log(err));
    } else {

        return next();
    }

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

            return next();
        })
        .catch(err => {

            console.log(err);

            req.randomQuote = failedToFetchQuote;

            return next();
            
        });
}

const fetchUserById = (req, res, next) => {

    const uid = req.params.id;

    sequelize.transaction(function(t) {
        
        return User.findOne({
            subQuery: false,
            raw: true,
            where: {
                u_id: uid
            }
        }, { transaction: t })
            .then(fetchedUser => {
                
                if (fetchedUser === null) {
                    
                    res.locals.userExists = false;
                    return next();
                    
                } else {
            
                    res.locals.userExists = true;
                    res.locals.user = fetchedUser;

                    return Forum.findAll({
                        raw: true,
                        where: {
                            author_id: uid
                        }
                    }, { transaction: t })
                        .then(userQues => {
                            res.locals.userQues = userQues;

                            return Blog.findAll({
                                raw: true,
                                where: {
                                    author_id: uid
                                }
                            }, { transaction: t })
                                .then(userBlogs => {
                                    
                                    res.locals.userBlogs = userBlogs;

                                    return ForumAnswer.count({
                                        where: {
                                            author_id: uid,
                                        }
                                    }, { transaction: t })
                                        .then(countAns => {
                                            res.locals.ansCount = countAns;
                                            return next();
                                        })
                                })
                        })
                }
            })
            .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}

module.exports = {
    fetchNavBarInfo,
    fetchRandomQuote,
    fetchUserById
}