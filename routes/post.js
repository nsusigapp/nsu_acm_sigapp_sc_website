
const router = require("express").Router();

const postController = require("../controllers/post");


router.post("/create-post", postController.createPost);

router.post("/delete-post:id", postController.deletePostById);


module.exports = {
    router
}