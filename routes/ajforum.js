
const router = require("express").Router();
const ajForumController = require("../controllers/ajforum");

router.get("/get-tags", ajForumController.getTags);

router.post("/like-forum-post", ajForumController.postForumLike);

module.exports = {
    router
}