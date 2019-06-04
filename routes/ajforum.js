
const router = require("express").Router();
const ajForumController = require("../controllers/ajforum");
const { redirectIfNotLoggedIn } = require("../middlewares/accessControl");

router.post("/like-forum-post", redirectIfNotLoggedIn, ajForumController.postForumLike);

router.post("/post-answer", redirectIfNotLoggedIn, ajForumController.forumPostAnswer);

module.exports = {
    router
}