
const router = require("express").Router();

const profileControllers = require("../controllers/profile");

router.post("/other-settings", profileControllers.updateSettings);

module.exports = {
    router
}