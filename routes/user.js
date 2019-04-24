
const router = require("express").Router();

const userControllers = require("../controllers/user");

router.get("/", userControllers.getIndexPage);

module.exports = {
    router
}