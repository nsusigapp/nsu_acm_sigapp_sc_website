
const authController= require("../controllers/auth");
const {validateRegForm}= require("../validator/validate");

const router= require("express").Router();

router.get("/register",authController.getRegisterPage);

router.post("/register",validateRegForm,authController.postRegisterUser);

module.exports= {
    router,
}