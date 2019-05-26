
const router = require("express").Router();

const userControllers = require("../controllers/user");
const { fetchForumCategories, loadForumDataInit, 
        getForumById, loadForumReplies, setupPagintion } = require("../middlewares/forum");
const { fetchUserById } = require("../middlewares/userData");

router.get("/", userControllers.getIndexPage);

router.get("/forum", fetchForumCategories, loadForumDataInit, setupPagintion, userControllers.getForumPage);

router.get("/forum-post/:id", getForumById, loadForumReplies, userControllers.getForumViewPage);

router.get("/blog", userControllers.getBlogPage);

router.get("/blog-post/:id", userControllers.getBlogViewPage);

router.get("/profile/:id", fetchUserById, userControllers.getUserProfilePage);

module.exports = {
    router
}