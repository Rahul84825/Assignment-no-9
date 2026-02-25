const mongoose = require("mongoose");

const passSchema = new mongoose.Schema(
  {
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visitor",
      required: true,
    },
    passCode: { type: String, required: true, unique: true },
    qrData: { type: String, required: true },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    issuedAt: { type: Date, default: Date.now },
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
    pdfPath: { type: String },
    status: {
      type: String,
      enum: ["active", "expired", "revoked"],
      default: "active",
    },
  },
  { timestamps: true },
);

passSchema.index({ passCode: 1, status: 1 });

const Pass = mongoose.model("Pass", passSchema);

module.exports = { Pass };
