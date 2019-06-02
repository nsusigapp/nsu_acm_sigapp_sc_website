
const router = require("express").Router();

const blogController = require("../controllers/blog");
const { redirectIfNotLoggedIn } = require("../middlewares/accessControl");

router.get("/create-blog-post", redirectIfNotLoggedIn, blogController.getBlogCreate);

router.post("/create-blog-post", redirectIfNotLoggedIn, blogController.createBlogPost);

router.post("/delete-blog:id", blogController.deleteBlogById);

module.exports = {
    router
}