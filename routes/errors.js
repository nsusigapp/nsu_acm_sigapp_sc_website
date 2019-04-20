
const errorController = require("../controllers/errors");

const router = require("express").Router();

router.use(errorController.fourOFour);

router.use(errorController.fiveHundread);

module.exports = {
    router,
}