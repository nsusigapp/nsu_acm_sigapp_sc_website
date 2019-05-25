
const router = require("express").Router();

const postController = require("../controllers/fpost");

router.get("/create-forum-post", postController.getForumCreate);

// router.post("/create-forum-post", postController.createForumPost);

router.post("/post-answer", postController.forumPostAnswer);

router.post("/delete-post:id", postController.deletePostById);

module.exports = {
    router
}