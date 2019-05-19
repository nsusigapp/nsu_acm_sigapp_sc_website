
const pageTitle = require("../utils/pageTitles");

const getIndexPage = (req, res, next) => {

    return res.render("index", {
        pageTitle: pageTitle.INDEX,
    });
}

const getForumPage = (req, res, next) => {

    const selectedTag = req.query.tag_name;

    return res.render("forum", {
        pageTitle: pageTitle.FORUM,
        active: selectedTag,
    });
}

module.exports = {
    getIndexPage,
    getForumPage,
}