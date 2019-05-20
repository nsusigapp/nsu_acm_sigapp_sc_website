
const router = require("express").Router();

const userControllers = require("../controllers/user");
const { fetchForumCategories, loadForumDataInit, getForumById } = require("../middlewares/forum");

router.get("/", userControllers.getIndexPage);

router.get("/forum", fetchForumCategories, loadForumDataInit, userControllers.getForumPage);

router.get("/forum-post/:id", getForumById, userControllers.getForumViewPage);

module.exports = {
    router
}