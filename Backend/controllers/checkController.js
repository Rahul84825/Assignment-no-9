const { Pass } = require("../models/Pass.js");
const { CheckLog } = require("../models/CheckLog.js");

const CHECK_ACTIONS = ["check_in", "check_out"];

exports.scanPass = async (req, res, next) => {
  try {
    const { action, gate } = req.body;
    const passCode = String(req.body.passCode || "").trim();

    if (!passCode || !action) {
      return res.status(400).json({ message: "passCode and action are required" });
    }

    if (!CHECK_ACTIONS.includes(action)) {
      return res.status(400).json({ message: "action must be check_in or check_out" });
    }

    const pass = await Pass.findOne({ passCode });
    if (!pass) return res.status(404).json({ message: "Pass not found" });

    const now = new Date();
    if (now < pass.validFrom || now > pass.validTo) {
      return res.status(400).json({ message: "Pass not valid at this time" });
    }
    if (pass.status !== "active") {
      return res.status(400).json({ message: "Pass not active" });
    }

    const log = await CheckLog.create({
      pass: pass._id,
      visitor: pass.visitor,
      action,
      gate,
      scannedBy: req.user?._id,
    });

    return res.json({ log });
  } catch (err) {
    next(err);
  }
};
