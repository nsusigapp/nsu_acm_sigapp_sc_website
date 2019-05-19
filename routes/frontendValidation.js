
const router = require("express").Router();

const fValidateController = require("../controllers/frontendValidation");

router.get("/check-username", fValidateController.checkUserNameAvailable);

module.exports = {
    router
}