const { nanoid } = require("nanoid");
const { Pass } = require("../models/Pass.js");
const { Visitor } = require("../models/Visitor.js");
const { Appointment } = require("../models/Appointment.js");
const { buildQrData, generateQrDataUrl, generatePassPdf } = require("../services/passService.js");

// convert string to date same thing done in appointmentControlller
const convertDate = (val) => {
  const d = new Date(val);

  if (isNaN(d.getTime())) {
    return null;
  }

  return d;
};

// issue new pass
exports.issuePass = async (req, res, next) => {
  try {
    const { visitorId, appointmentId, validFrom, validTo } = req.body;

    // check required fields
    if (!visitorId || !validFrom || !validTo) {
      return res.status(400).json({
        message: "visitorId, validFrom and validTo are required",
      });
    }

    const from = convertDate(validFrom);
    const to = convertDate(validTo);

    // validate dates
    if (!from || !to) {
      return res.status(400).json({
        message: "Invalid date",
      });
    }

    // check logic
    if (to <= from) {
      return res.status(400).json({
        message: "validTo must be greater than validFrom",
      });
    }

    // check visitor exists
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found",
      });
    }

    let appointment = null;

    // if appointment is given
    if (appointmentId) {
      appointment = await Appointment.findById(appointmentId).populate("host", "name");

      if (!appointment) {
        return res.status(404).json({
          message: "Appointment not found",
        });
      }

      // only approved appointments allowed
      if (appointment.status !== "approved") {
        return res.status(400).json({
          message: "Appointment not approved",
        });
      }
    }

    // generate unique pass code
    const passCode = "VP-" + nanoid(8).toUpperCase();

    // create pass (initially qrData empty)
    const pass = new Pass({
      visitor: visitor._id,
      appointment: appointment ? appointment._id : null,
      passCode: passCode,
      qrData: "pending",
      issuedBy: req.user?._id,
      validFrom: from,
      validTo: to,
    });

    await pass.save();

    // generate QR data and store it in DB
    const qrData = await buildQrData(pass);
    pass.qrData = qrData;

    // generate qr image
    const qrUrl = await generateQrDataUrl(qrData);

    const hostName = appointment && appointment.host ? appointment.host.name : "Walk-in";

    // create PDF pass with visitor + QR details
    const pdfPath = await generatePassPdf({
      pass,
      visitor,
      hostName,
      qrDataUrl: qrUrl,
      uploadDir: process.env.UPLOAD_DIR || "uploads",
    });

    pass.pdfPath = pdfPath;

    await pass.save();

    res.status(201).json({
      pass,
      qrDataUrl: qrUrl,
    });
  } catch (err) {
    next(err);
  }
};

// get all passes
exports.listPasses = async (req, res, next) => {
  try {
    const passes = await Pass.find()
      .populate("visitor")
      .sort({ createdAt: -1 });

    res.json(passes);
  } catch (err) {
    next(err);
  }
};

// get pass using code
exports.getPassByCode = async (req, res, next) => {
  try {
    const code = req.params.code;

    const pass = await Pass.findOne({ passCode: code }).populate("visitor");

    if (!pass) {
      return res.status(404).json({
        message: "Pass not found",
      });
    }

    res.json(pass);
  } catch (err) {
    next(err);
  }
};

// get passes for logged-in visitor
exports.getVisitorPasses = async (req, res, next) => {
  try {
    const visitor = await Visitor.findOne({ email: req.user.email });

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found",
      });
    }

    const passes = await Pass.find({ visitor: visitor._id })
      .populate("visitor")
      .populate("appointment")
      .sort({ createdAt: -1 });

    res.json(passes);
  } catch (err) {
    next(err);
  }
};