
const getIndexPage = (req, res, next) => {

    return res.render("index",{
        pageTitle: "Home Page"
    });
}

module.exports = {
    getIndexPage,
}