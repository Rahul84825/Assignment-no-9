const { Router } = require("express");
const { login, register, registerVisitor } = require("../controllers/authController.js");
const validate = require("../middleware/validate.js");
const { authSchemas, visitorSchemas } = require("../middleware/validationSchemas.js");
const upload = require("../middleware/upload.js");

const router = Router();

router.post("/register", validate(authSchemas.register), register);
router.post("/register-visitor", upload.single("photo"), registerVisitor);
router.post("/login", validate(authSchemas.login), login);

module.exports = router;
