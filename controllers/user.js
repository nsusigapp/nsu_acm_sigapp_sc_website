
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


module.exports = {
    getIndexPage,
    getForumPage,
    getForumViewPage
}