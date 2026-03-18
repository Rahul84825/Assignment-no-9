const { Router } = require("express");
const { getPassByCode, issuePass, listPasses, getVisitorPasses } = require("../controllers/passController.js");
const { requireAuth, requireRole } = require("../middleware/auth.js");
const validate = require("../middleware/validate.js");
const { passSchemas } = require("../middleware/validationSchemas.js");

const router = Router();

router.use(requireAuth);
router.get("/", requireRole("admin", "security"), listPasses);
router.get("/my-passes", requireRole("visitor"), getVisitorPasses);
router.post("/", requireRole("admin", "security"), validate(passSchemas.issue), issuePass);
router.get("/:code", requireRole("admin", "security", "host"), getPassByCode);

module.exports = router;
