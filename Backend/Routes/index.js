const { Router } = require("express");
const authRoutes = require("./authRoutes.js");
const visitorRoutes = require("./visitorRoutes.js");
const appointmentRoutes = require("./appointmentRoutes.js");
const passRoutes = require("./passRoutes.js");
const checkRoutes = require("./checkRoutes.js");
const reportRoutes = require("./reportRoutes.js");
const userRoutes = require("./userRoutes.js");

const router = Router();

router.use("/auth", authRoutes);
router.use("/visitors", visitorRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/passes", passRoutes);
router.use("/check", checkRoutes);
router.use("/reports", reportRoutes);
router.use("/users", userRoutes);

module.exports = router;
