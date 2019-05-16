
const router = require("express").Router();

const fValidateController = require("../controllers/frontendValidation");

router.post("/check-username", fValidateController.checkUserNameAvailable);

module.exports = {
    router
}