
const router = require("express").Router();

const userControllers = require("../controllers/user");
const { fetchForumCategories, loadForumDataInit } = require("../middlewares/forum");

router.get("/", userControllers.getIndexPage);

router.get("/forum", fetchForumCategories, loadForumDataInit, userControllers.getForumPage);


module.exports = {
    router
}