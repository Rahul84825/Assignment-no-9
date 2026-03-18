const { Appointment } = require("../models/Appointment.js");
const { Visitor } = require("../models/Visitor.js");

// function to convert string into date
const convertDate = (val) => {
  const d = new Date(val);

  // checking if date is invalid
  if (isNaN(d.getTime())) {
    return null;
  }

  return d;
};

// to create appointment
exports.createAppointment = async (req, res, next) => {
  try {
    const { visitorId, hostId, purpose, startTime, endTime } = req.body;

    const start = convertDate(startTime);
    const end = convertDate(endTime);

    // checking visitor exists or not
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      console.warn(`[Appointment Fail] Visitor not found: ${visitorId}`);
      return res.status(404).json({
        message: "Visitor not found",
      });
    }

    // creating new appointment
    const appointment = new Appointment({
      visitor: visitorId,
      host: hostId,
      purpose: purpose,
      startTime: start,
      endTime: end,
      status: "pending", // default status will be pending
    });

    await appointment.save();
    console.log(`[Appointment Created] ID: ${appointment._id}`);

    res.status(201).json(appointment);
  } catch (err) {
    console.error(`[Appointment Creation Error] ${err.message}`);
    next(err);
  }
};

// get all appointments
exports.listAppointments = async (req, res, next) => {
  try {
    const { status } = req.query;

    let filter = {};

    // if status is passed, filter data
    if (status) {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter)
      .populate("visitor")
      .populate("host", "name email")
      .sort({ startTime: -1 });

    res.json(appointments);
  } catch (err) {
    next(err);
  }
};

// approve appointments
exports.approveAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // already approved check
    if (appointment.status === "approved") {
      return res.status(400).json({
        message: "Already approved",
      });
    }

    appointment.status = "approved";
    // this line tells who approved the appointment
    appointment.approvedBy = req.user?._id; 

    await appointment.save();

    res.json(appointment);
  } catch (err) {
    next(err);
  }
};

// reject appointment
exports.rejectAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // already rejected check
    if (appointment.status === "rejected") {
      return res.status(400).json({
        message: "Already rejected",
      });
    }

    appointment.status = "rejected";
    // Same checks who Rejected it 
    appointment.approvedBy = req.user?._id;

    await appointment.save();

    res.json(appointment);
  } catch (err) {
    next(err);
  }
};