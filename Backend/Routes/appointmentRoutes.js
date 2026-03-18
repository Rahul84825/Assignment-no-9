const { Router } = require("express");
const {
  approveAppointment,
  createAppointment,
  listAppointments,
  rejectAppointment,
} = require("../controllers/appointmentController.js");
const { requireAuth, requireRole } = require("../middleware/auth.js");
const validate = require("../middleware/validate.js");
const { appointmentSchemas } = require("../middleware/validationSchemas.js");

const router = Router();

router.use(requireAuth);
router.get("/", requireRole("admin", "security", "host"), listAppointments);
router.post("/", requireRole("admin", "security", "host"), validate(appointmentSchemas.create), createAppointment);
router.post("/:id/approve", requireRole("admin", "host"), approveAppointment);
router.post("/:id/reject", requireRole("admin", "host"), rejectAppointment);

module.exports = router;
