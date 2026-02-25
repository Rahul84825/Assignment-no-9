const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    idNumber: { type: String, trim: true },
    photoUrl: { type: String },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {timestamps: true},
);

visitorSchema.index({ email: 1, phone: 1 });

const Visitor = mongoose.model("Visitor", visitorSchema);

module.exports = { Visitor };
