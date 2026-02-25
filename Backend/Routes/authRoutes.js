const { Router } = require("express");
const { login, register, registerVisitor } = require("../controllers/authController.js");

const router = Router();

router.post("/register", register);
router.post("/register-visitor", registerVisitor);
router.post("/login", login);

module.exports = router;
