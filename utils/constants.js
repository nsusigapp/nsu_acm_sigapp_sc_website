
const limitPost = {
    FORUM: 20
}

const forumLike = {
    LIKE: 1,
    UNLIKE: 0,
    NOT_LOGGED_IN: -1
}

const cookieOpt = { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 }

module.exports = {
    limitPost,
    forumLike,
    cookieOpt
}