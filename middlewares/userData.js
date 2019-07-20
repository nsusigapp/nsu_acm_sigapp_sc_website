const { sequelize, users: User, quotes: Quote, 
        forum: Forum, blog: Blog, forum_answer: ForumAnswer } = require("../models/index");

// fetch profile picture from DB;
const fetchNavBarInfo = async (req, res, next) => {

    if (res.locals.userInfo && res.locals.userInfo.loggedIn) {

        try {
            
            const fetchedResponse = await User.findOne({
                attributes: ["avatar_url","first_name"],
                where: {
                    u_id: res.locals.userInfo.sessionData.uid,
                }
            });
    
            req.app.locals.headerInfo = fetchedResponse;
            return next();

        } catch (err) {

            console.log(err);
        }

    } else {

        return next();
    }

}

const fetchRandomQuote = async (req, res, next) => {

    const failedToFetchQuote = "Error 404, Quote not found :')";

    try {
        
        const fetchedQuotes = await Quote.findAll({
            attributes: ["quote_text"]
        });
            
        const min = 0;
        const max = fetchedQuotes.length - 1;
        const randomQuote = fetchedQuotes[Math.floor(Math.random() * (max - min + 1) + min)];
        
        req.randomQuote = randomQuote.quote_text;
        
        return next();

    } catch (err) {

        console.log(err);

        req.randomQuote = failedToFetchQuote;

        return next();
    }
}

const fetchUserById = async (req, res, next) => {

    const uid = req.params.id;

    try {

        await sequelize.transaction(async function(t) {
        
            const fetchedUser = await User.findOne({
                subQuery: false,
                raw: true,
                where: {
                    u_id: uid
                }
            }, { transaction: t });
    
            if (fetchedUser === null) {
                        
                res.locals.userExists = false;
                return next();
                        
            } else {
                
                res.locals.userExists = true;
                res.locals.user = fetchedUser;
    
                const userQues = await Forum.findAll({
                    raw: true,
                    where: {
                        author_id: uid
                    }
                }, { transaction: t });
                
                res.locals.userQues = userQues;
    
                const userBlogs = await Blog.findAll({
                    raw: true,
                    where: {
                        author_id: uid
                    }
                }, { transaction: t });
                                                            
                res.locals.userBlogs = userBlogs;
    
                const countAns = await ForumAnswer.count({
                    where: {
                        author_id: uid,
                    }
                }, { transaction: t });
                                            
                res.locals.ansCount = countAns;
                return next();
    
            }
        });
        
    } catch (err) {
        
        console.log(err);
    }
}

module.exports = {
    fetchNavBarInfo,
    fetchRandomQuote,
    fetchUserById
}