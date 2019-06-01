
const redirectIfLoggedIn = (req, res, next) => {

    if (res.locals.userInfo.loggedIn) {

        return res.redirect("/");

    } else {

        next();
    }
}

const redirectIfNotLoggedIn = (req, res, next) => {

    if (!(res.locals.userInfo.loggedIn)) {

        return res.redirect("/");

    } else {

        next();
    }
}

const isAuthorized = (req, res, next) => {

    const { u_id } = req.body;
    
    const { loggedIn, sessionData, isAdmin } = res.locals.userInfo;
    
    const uid = loggedIn ? parseInt(u_id) : null;

    const actionAllowed = uid === sessionData.uid || isAdmin ? true : false;

    if (actionAllowed) {
        
        next();

    } else {

        return res.json({
            unauthorized: true,
        });
    }
}

module.exports = {
    redirectIfLoggedIn,
    redirectIfNotLoggedIn,
    isAuthorized
}