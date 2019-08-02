
const router = require("express").Router();

const userControllers = require("../controllers/user");

const { loadForumDataInit, 
        getForumById, loadForumReplies, setupPagintion } = require("../middlewares/forum");

const { loadBlogDataInit, getBlogById, loadBlogComments } = require("../middlewares/blog");
        
const { fetchUserById } = require("../middlewares/userData");
const { fetchCategories } = require("../middlewares/common");
const { isDisabled } = require("../middlewares/accessControl");
const { loadEvents, getEventById } = require("../middlewares/event");

router.get("/", userControllers.getIndexPage);

router.get("/forum", fetchCategories, loadForumDataInit, setupPagintion, userControllers.getForumPage);

router.get("/forum-post/:id", getForumById, loadForumReplies, userControllers.getForumViewPage);

router.get("/blog", fetchCategories, loadBlogDataInit, userControllers.getBlogPage);

router.get("/blog-post/:id", getBlogById, loadBlogComments, userControllers.getBlogViewPage);

router.get("/event", loadEvents, userControllers.getEventPage);

router.get("/event-details/:id", getEventById, userControllers.getEventViewPage);

router.get("/profile/:id", isDisabled, fetchUserById, userControllers.getUserProfilePage);

module.exports = {
    router
}