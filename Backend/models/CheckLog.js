const mongoose = require("mongoose");

const checkLogSchema = new mongoose.Schema(
  {
    pass: { type: mongoose.Schema.Types.ObjectId, ref: "Pass", required: true },
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visitor",
      required: true,
    },
    action: { type: String, enum: ["check_in", "check_out"], required: true },
    scannedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    gate: { type: String, trim: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

checkLogSchema.index({ timestamp: -1 });

const CheckLog = mongoose.model("CheckLog", checkLogSchema);

module.exports = { CheckLog };
