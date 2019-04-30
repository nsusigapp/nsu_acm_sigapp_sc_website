
const pageTitle = require("../utils/pageTitles");

const getIndexPage = (req, res, next) => {

    return res.render("index",{
        pageTitle: pageTitle.INDEX,
    });
}

module.exports = {
    getIndexPage,
}