
const authController= require("../controllers/auth");
const router= require("express").Router();

router.get("/register",authController.getRegisterPage)

router.post("/register",authController.postRegisterUser);

module.exports= {
    router,
}