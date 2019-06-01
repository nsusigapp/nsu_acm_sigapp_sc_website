
const router = require("express").Router();

const userControllers = require("../controllers/user");

const { loadForumDataInit, 
        getForumById, loadForumReplies, setupPagintion } = require("../middlewares/forum");

const { loadBlogDataInit, getBlogById } = require("../middlewares/blog");
        
const { fetchUserById } = require("../middlewares/userData");
const { fetchCategories } = require("../middlewares/common");

router.get("/", userControllers.getIndexPage);

router.get("/forum", fetchCategories, loadForumDataInit, setupPagintion, userControllers.getForumPage);

router.get("/forum-post/:id", getForumById, loadForumReplies, userControllers.getForumViewPage);

router.get("/blog", fetchCategories, loadBlogDataInit, userControllers.getBlogPage);

router.get("/blog-post/:id", getBlogById, userControllers.getBlogViewPage);

router.get("/profile/:id", fetchUserById, userControllers.getUserProfilePage);

module.exports = {
    router
}