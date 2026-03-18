const { Router } = require("express");
const { createVisitor, getVisitor, listVisitors } = require("../controllers/visitorController.js");
const { requireAuth, requireRole } = require("../middleware/auth.js");
const validate = require("../middleware/validate.js");
const { visitorSchemas } = require("../middleware/validationSchemas.js");
const upload = require("../middleware/upload.js");

const router = Router();

router.use(requireAuth);
router.get("/", requireRole("admin", "security", "host"), listVisitors);
router.post("/", requireRole("admin", "security", "host"), upload.single("photo"), validate(visitorSchemas.create), createVisitor);
router.get("/:id", requireRole("admin", "security", "host"), getVisitor);

module.exports = router;
