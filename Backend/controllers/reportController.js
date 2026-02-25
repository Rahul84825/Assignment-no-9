const { Pass } = require("../models/Pass.js");
const { CheckLog } = require("../models/CheckLog.js");

async function getSummary(req, res, next) {
  try {
    const totalPasses = await Pass.countDocuments();
    const totalCheckIns = await CheckLog.countDocuments({ action: "check_in" });
    const totalCheckOuts = await CheckLog.countDocuments({ action: "check_out" });

    res.json({
      totalPasses,
      totalCheckIns,
      totalCheckOuts,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSummary };
