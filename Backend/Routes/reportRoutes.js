const { Router } = require("express");
const { getSummary } = require("../controllers/reportController.js");
const { requireAuth, requireRole } = require("../middleware/auth.js");

const router = Router();

router.use(requireAuth);
router.get("/summary", requireRole("admin"), getSummary);

module.exports = router;
