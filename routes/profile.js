
const router = require("express").Router();

const profileControllers = require("../controllers/profile");
const { redirectIfNotLoggedIn, isAuthorized } = require("../middlewares/accessControl");

router.post("/other-settings", redirectIfNotLoggedIn, isAuthorized, profileControllers.updateSettings);

router.post("/change-password", redirectIfNotLoggedIn, isAuthorized, 
        profileControllers.matchPassword, profileControllers.adminChangePassword, 
        profileControllers.userChangePassword);

module.exports = {
    router
}