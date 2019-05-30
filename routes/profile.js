
const router = require("express").Router();

const profileControllers = require("../controllers/profile");
const { redirectIfNotLoggedIn } = require("../middlewares/accessControl");

router.post("/other-settings", redirectIfNotLoggedIn, profileControllers.updateSettings);

router.post("/change-password", redirectIfNotLoggedIn, profileControllers.changePassword);

module.exports = {
    router
}