const { Router } = require("express");
const { createVisitor, getVisitor, listVisitors } = require("../controllers/visitorController.js");
const { requireAuth, requireRole } = require("../middleware/auth.js");

const router = Router();

router.use(requireAuth);
router.get("/", requireRole("admin", "security", "host"), listVisitors);
router.post("/", requireRole("admin", "security", "host"), createVisitor);
router.get("/:id", requireRole("admin", "security", "host"), getVisitor);

module.exports = router;
