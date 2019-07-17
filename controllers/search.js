
const pageTitle =  require("../utils/pageTitles");

const getSearchPage = (req, res, next) => {

    console.log(req.query.searchKey);

    return res.render("search", {
        pageTitle: pageTitle.SEARCH_RES
    })
}

module.exports = {
    getSearchPage
}