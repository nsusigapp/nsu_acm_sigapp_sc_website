
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

module.exports = {
    redirectIfLoggedIn,
    redirectIfNotLoggedIn
}