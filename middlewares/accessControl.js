
const { forum: Forum, blog: Blog, users: User } = require("../models/index");

const { userStatus } = require("../utils/userConst");

const redirectIfLoggedIn = (req, res, next) => {

    if (res.locals.userInfo.loggedIn) {

        return res.redirect("/");

    } else {

        return next();
    }
}

const redirectIfNotLoggedIn = (req, res, next) => {

    if (!(res.locals.userInfo.loggedIn)) {

        return res.redirect("/");

    } else {

        return next();
    }
}

const isAdmin = (req, res, next) => {

    if (res.locals.userInfo.isAdmin) {

        return next();
    
    } else {
    
        return res.redirect("/");
    }
}

const isAuthorized = (req, res, next) => {

    const { u_id } = req.body;
    
    const { loggedIn, sessionData, isAdmin } = res.locals.userInfo;
    
    const uid = loggedIn ? parseInt(u_id) : null;

    const actionAllowed = uid === sessionData.uid || isAdmin ? true : false;

    if (actionAllowed) {
        
        return next();

    } else {

        return res.json({
            unauthorized: true,
        });
    }
}

const canEditBlog = async (req, res, next) => {

    const blogId = req.params.id;

    const errors = {
        blogExists: false,
        unauthorized: false
    }

    try {

        const fetchedBlog = await Blog.findOne({
            where: {
                blog_id: blogId
            }
        });
            
        if (fetchedBlog === null) {

            res.locals.error = errors;
            return next();
        }

        errors.blogExists = true;
        
        const { author_id } = fetchedBlog;

        const { sessionData, isAdmin } = res.locals.userInfo;

        const actionAllowed = author_id === sessionData.uid || isAdmin ? true : false;

        if (!actionAllowed) {

            errors.unauthorized = true;

            res.locals.error = errors;
            return next();
        }

        res.locals.error = errors;

        req.fetchedBlog = fetchedBlog;
        return next();

    } catch (err) {
        
        console.log(err);
    }
}

const isDisabled = async (req, res, next) => {

    if (res.locals.userInfo.isAdmin) {

        res.locals.userError = false;
        return next();   
    }

    const fetchedUser = await User.findOne({
        attributes: ["status"],
        where: {
            u_id: req.params.id
        }
    });

    if (fetchedUser === null || fetchedUser.status === userStatus.PENDING || fetchedUser.status === userStatus.IN_ACTIVE) {
                    
        res.locals.userError = true;
        return next();
    }

    res.locals.userError = false;
    return next();
}

const canEditForum = async (req, res, next) => {

    const forumId = req.params.id;

    try {

        const fetchedForum = await Forum.findOne({
            where: {
                f_post_id: forumId
            }
        });
            
        if (fetchedForum === null) {

            res.locals.forumExists = false;
            return next();
        }                
        
        const { author_id } = fetchedForum;

        const { sessionData, isAdmin } = res.locals.userInfo;

        const actionAllowed = author_id === sessionData.uid || isAdmin ? true : false;

        if (!actionAllowed) {

            res.locals.unauthorized = true;
            return next();
        }

        res.locals.unauthorized = false;
        req.fetchedForum = fetchedForum;
        return next();

    } catch (err) {
        
        console.log(err);
    }
}

module.exports = {
    redirectIfLoggedIn,
    redirectIfNotLoggedIn,
    isAuthorized,
    canEditBlog,
    canEditForum,
    isAdmin,
    isDisabled
}