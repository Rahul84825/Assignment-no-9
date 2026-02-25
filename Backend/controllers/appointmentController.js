const { Appointment } = require("../models/Appointment.js");
const { Visitor } = require("../models/Visitor.js");
const Joi = require("joi");

const appointmentSchema = Joi.object({
  visitorId: Joi.string().required(),
  hostId: Joi.string().required(),
  purpose: Joi.string().required(),
  startTime: Joi.date().required(),
  endTime: Joi.date().required(),
});

async function createAppointment(req, res, next) {
  try {
    const { value, error } = appointmentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const visitor = await Visitor.findById(value.visitorId);
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });

    const appointment = await Appointment.create({
      visitor: value.visitorId,
      host: value.hostId,
      purpose: value.purpose,
      startTime: value.startTime,
      endTime: value.endTime,
      status: "pending",
    });

    res.status(201).json(appointment);
  } catch (err) {
    next(err);
  }
}

async function listAppointments(req, res, next) {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const appointments = await Appointment.find(filter)
      .populate("visitor")
      .populate("host", "name email")
      .sort({ startTime: -1 })
      .limit(200)
      .lean();
    res.json(appointments);
  } catch (err) {
    next(err);
  }
}

async function approveAppointment(req, res, next) {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.status = "approved";
    appointment.approvedBy = req.user?._id;
    await appointment.save();
    res.json(appointment);
  } catch (err) {
    next(err);
  }
}

async function rejectAppointment(req, res, next) {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.status = "rejected";
    appointment.approvedBy = req.user?._id;
    await appointment.save();
    res.json(appointment);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createAppointment,
  listAppointments,
  approveAppointment,
  rejectAppointment,
};
