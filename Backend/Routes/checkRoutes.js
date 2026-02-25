const { Router } = require("express");
const { scanPass } = require("../controllers/checkController.js");
const { requireAuth, requireRole } = require("../middleware/auth.js");

const router = Router();

router.use(requireAuth);
router.post("/scan", requireRole("admin", "security"), scanPass);

module.exports = router;
