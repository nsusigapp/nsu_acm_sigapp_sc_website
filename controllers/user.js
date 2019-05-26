
const pageTitle = require("../utils/pageTitles");
const dateFormat =  require("../utils/util");

const getIndexPage = (req, res, next) => {

    return res.render("index", {
        pageTitle: pageTitle.INDEX
    });
}

const getForumPage = (req, res, next) => {

    const selectedTag = req.query.tag_name;

    return res.render("forum", {
        pageTitle: pageTitle.FORUM,
        active: selectedTag,
        dateFormat
    });
}

const getForumViewPage = (req, res, next) => {

    return res.render("forum_view", {
        pageTitle: pageTitle.FORUM_VIEW,
        dateFormat
    });
}

const getBlogPage = (req, res, next) => {

    const selectedTag = req.query.tag_name;

    return res.render("blog", {
        pageTitle: pageTitle.BLOG,
        active: selectedTag,
        dateFormat
    });
}

const getBlogViewPage = (req, res, next) => {

    return res.render("blog_view", {
        pageTitle: pageTitle.BLOG_VIEW,
        dateFormat
    });
}

const getUserProfilePage = (req, res, next) => {

    return res.render("user_profile", {
        pageTitle: pageTitle.PROFILE,
        dateFormat
    });
}

module.exports = {
    getIndexPage,
    getForumPage,
    getForumViewPage,
    getBlogPage,
    getBlogViewPage,
    getUserProfilePage
}