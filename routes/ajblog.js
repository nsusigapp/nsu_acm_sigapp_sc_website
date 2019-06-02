
const router = require("express").Router();

const ajBlogController = require("../controllers/ajblog");
const { redirectIfNotLoggedIn } = require("../middlewares/accessControl");

router.post("/post-comment", redirectIfNotLoggedIn, ajBlogController.blogPostComment);

module.exports = {
    router
}