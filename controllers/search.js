
const getSearchPage = (req, res, next) => {

    console.log(req.query.searchKey);

    res.json({
        error: "none",
    })
}

module.exports = {
    getSearchPage
}