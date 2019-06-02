
const router = require("express").Router();
const ajCommonController = require("../controllers/ajcommon");

router.get("/get-tags", ajCommonController.getTags);

module.exports = {
    router
}