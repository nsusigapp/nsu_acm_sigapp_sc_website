
const pageTitle =  require("../utils/pageTitles");

const getSearchPage = (req, res, next) => {

    return res.render("search", {
        pageTitle: pageTitle.SEARCH_RES,
        searchKey: req.query.searchKey,
        active: req.query.active.toUpperCase()
    });
}

module.exports = {
    getSearchPage
}