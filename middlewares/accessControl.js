
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

const canEditBlog = (req, res, next) => {

    const blogId = req.params.id;

    Blog.findOne({
        where: {
            blog_id: blogId
        }
    })
        .then(fetchedBlog => {

            if (fetchedBlog === null) {

                console.log("baal")

                res.locals.blogExists = false;
                return next();

            } else {
                
                console.log("how is this shit being executed")
                const { author_id } = fetchedBlog;

                const { sessionData, isAdmin } = res.locals.userInfo;

                const actionAllowed = author_id === sessionData.uid || isAdmin ? true : false;

                if (!actionAllowed) {

                    console.log("does run")

                    res.locals.unauthorized = true;
                    return next();

                } else {

                    req.fetchedBlog = fetchedBlog;
                    return next();
                }
            }
        })
        .catch(err => console.log(err));
}

const isDisabled = (req, res, next) => {

    if (res.locals.userInfo.isAdmin) {

        res.locals.userError = false;
        return next();
        
    } else {

        User.findOne({
            attributes: ["status"],
            where: {
                u_id: req.params.id
            }
        })
            .then(fetchedUser => {

                if (fetchedUser === null || fetchedUser.status === userStatus.PENDING || fetchedUser.status === userStatus.IN_ACTIVE) {
                    
                    res.locals.userError = true;
                    return next();

                } else {

                    res.locals.userError = false;
                    return next();
                }

            })
            .catch(err => console.log(err));
    }
}

const canEditForum = (req, res, next) => {

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