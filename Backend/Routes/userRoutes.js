const { Router } = require("express");
const { listUsers } = require("../controllers/userController.js");
const { requireAuth, requireRole } = require("../middleware/auth.js");

const router = Router();

router.use(requireAuth);
router.get("/", requireRole("admin", "security", "host"), listUsers);

module.exports = router;
