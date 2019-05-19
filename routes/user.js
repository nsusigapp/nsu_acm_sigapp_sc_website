
const router = require("express").Router();

const userControllers = require("../controllers/user");
const { fetchForumCategories } = require("../middlewares/forum");

router.get("/", userControllers.getIndexPage);

router.get("/forum", fetchForumCategories, userControllers.getForumPage);


module.exports = {
    router
}