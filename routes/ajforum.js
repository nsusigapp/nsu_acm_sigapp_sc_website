
const router = require("express").Router();
const ajForumController = require("../controllers/ajforum");

router.post("/like-forum-post", ajForumController.postForumLike);

module.exports = {
    router
}