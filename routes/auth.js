
const authController= require("../controllers/auth");
const {validateRegForm}= require("../validator/validate");
const {validateLogInForm}= require("../validator/validate");


const router= require("express").Router();

router.get("/register",authController.getRegisterPage);

router.post("/register",validateRegForm,authController.postRegisterUser);

router.get("/login",authController.getLoginPage);

router.post("/login",validateLogInForm,authController.postLoginUser);

router.post("/logout",authController.postLogout);

module.exports = {
    router,
}