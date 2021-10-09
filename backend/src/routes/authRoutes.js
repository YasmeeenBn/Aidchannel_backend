const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/authController");
const { userSignupValidator } = require("../middlewares/userValidator");

router.post("/signup", userSignupValidator, authCtrl.signup);
router.post("/signin", authCtrl.signin);
router.get("/signout", authCtrl.signout);

module.exports = router;