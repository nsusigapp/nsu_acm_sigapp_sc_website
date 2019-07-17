
const router = require("express").Router();

const searchController = require("../controllers/search");
const { searchBlog, searchForum, searchEvent } = require("../middlewares/dataSearch");

router.get("/search", searchBlog, searchForum, searchEvent, searchController.getSearchPage);

module.exports = {
    router
}