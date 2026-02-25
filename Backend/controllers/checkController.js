const Joi = require("joi");
const { Pass } = require("../models/Pass.js");
const { CheckLog } = require("../models/CheckLog.js");

const checkSchema = Joi.object({
  passCode: Joi.string().required(),
  action: Joi.string().valid("check_in", "check_out").required(),
  gate: Joi.string().allow("", null),
});

async function scanPass(req, res, next) {
  try {
    const { value, error } = checkSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const pass = await Pass.findOne({ passCode: value.passCode });
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
      action: value.action,
      gate: value.gate,
      scannedBy: req.user?._id,
    });

    res.json({ log });
  } catch (err) {
    next(err);
  }
}

module.exports = { scanPass };
