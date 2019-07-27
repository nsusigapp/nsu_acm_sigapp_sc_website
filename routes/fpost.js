
const router = require("express").Router();

const postController = require("../controllers/fpost");
const { redirectIfNotLoggedIn } = require("../middlewares/accessControl");

router.get("/create-forum-post", redirectIfNotLoggedIn, postController.getForumCreate);

router.post("/create-forum-post", redirectIfNotLoggedIn, postController.ajCreateForumPost);

router.post("/delete-post:id", postController.deletePostById);

module.exports = {
    router
}