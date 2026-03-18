const { Router } = require("express");
const { getSummary, exportCSV, exportPDF } = require("../controllers/reportController.js");
const { requireAuth, requireRole } = require("../middleware/auth.js");

const router = Router();

router.use(requireAuth);
router.get("/summary", requireRole("admin"), getSummary);
router.get("/export/csv", requireRole("admin"), exportCSV);
router.get("/export/pdf", requireRole("admin"), exportPDF);

module.exports = router;
