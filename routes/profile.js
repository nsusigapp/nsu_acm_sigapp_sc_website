
const router = require("express").Router();

const profileControllers = require("../controllers/profile");

router.post("/other-settings", profileControllers.updateSettings);

router.post("/change-password", profileControllers.changePassword);

module.exports = {
    router
}