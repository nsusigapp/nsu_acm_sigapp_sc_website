
const errorController = require("../controllers/error");

const router = require("express").Router();

router.use(errorController.fourOFour);

router.use(errorController.fiveHundread);

module.exports = {
    router,
}