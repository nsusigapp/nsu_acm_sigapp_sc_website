
const authController = require("../controllers/auth");
const { validateRegForm } = require("../validator/validate");
const { validateLogInForm } = require("../validator/validate");
const { redirectIfLoggedIn } = require("../middlewares/accessControl");
const { fetchRandomQuote } = require("../middlewares/userData");


const router = require("express").Router();

router.get("/register", redirectIfLoggedIn, authController.getRegisterPage);

router.post("/register", validateRegForm, authController.postRegisterUser);

router.get("/login", redirectIfLoggedIn, fetchRandomQuote, authController.getLoginPage);

router.post("/login", validateLogInForm, authController.postLoginUser);

router.post("/logout", authController.postLogout);

router.get("/forgot-password", redirectIfLoggedIn, authController.getForgotPasswdPage);

router.post("/forgot-password", authController.postForgotPassword);

module.exports = {
    router,
}