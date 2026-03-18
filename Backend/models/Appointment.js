const mongoose = require("mongoose");

// schema for appointment
const appointmentSchema = new mongoose.Schema(
  {
    // reference to visitor (who is coming)
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visitor",
      required: true,
    },

    // reference to host (employee/user)
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // purpose of visit
    purpose: {
      type: String,
      required: true,
    },

    // appointment start time
    startTime: {
      type: Date,
      required: true,
      index: true, // simple index for faster queries
    },

    // appointment end time
    endTime: {
      type: Date,
      required: true,
    },

    // current status of appointment
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
      index: true,
    },

    // which user approved/rejected
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// model creation
const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = { Appointment };