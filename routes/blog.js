
const router = require("express").Router();

const blogController = require("../controllers/blog");
const { prepareBlogEditData } = require("../middlewares/blog");
const { redirectIfNotLoggedIn, canEditBlog } = require("../middlewares/accessControl");

router.get("/create-blog-post", redirectIfNotLoggedIn, blogController.getBlogCreate);

router.post("/create-blog-post", redirectIfNotLoggedIn, blogController.createBlogPost);

router.get("/edit-blog/:id", redirectIfNotLoggedIn, canEditBlog, prepareBlogEditData, blogController.getBlogEditPage);

router.post("/edit-blog/:id", redirectIfNotLoggedIn, canEditBlog, blogController.postEditBlog);

router.get("/delete-blog/:id", blogController.deleteBlogById);

module.exports = {
    router
}