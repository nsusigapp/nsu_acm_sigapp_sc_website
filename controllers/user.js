
const pageTitle = require("../utils/pageTitles");

const getIndexPage = (req, res, next) => {

    return res.render("index",{
        pageTitle: pageTitle.INDEX,
    });
}

const getForumPage = (req, res, next) => {

    return res.render("forum",{
        pageTitle: pageTitle.FORUM,
    });
}

module.exports = {
    getIndexPage,
    getForumPage,
}