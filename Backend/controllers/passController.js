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

// function to generate random pass code (student style)
const generateCode = () => {
  return "VP-" + Math.random().toString(36).substring(2, 10).toUpperCase();
};

// issue new pass
exports.issuePass = async (req, res, next) => {
  try {
    const { visitorId, appointmentId, validFrom, validTo } = req.body;

    const visitor = await Visitor.findById(visitorId);
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });

    let appointment = null;
    let hostName = "Walk-in";

    if (appointmentId) {
      appointment = await Appointment.findById(appointmentId).populate("host");
      if (appointment && appointment.host) {
        hostName = appointment.host.name;
      }
    }

    const passCode = generateCode();

    // creating pass object
    const pass = new Pass({
      visitor: visitorId,
      appointment: appointmentId || null,
      passCode: passCode,
      qrData: "pending",
      issuedBy: req.user?._id,
      validFrom: new Date(validFrom),
      validTo: new Date(validTo),
    });

    // save first to get ID
    await pass.save();

    // generate QR and PDF
    const qrData = JSON.stringify({ code: passCode, visitor: visitorId });
    const qrUrl = await generateQrDataUrl(qrData);
    
    const pdfPath = await generatePassPdf({
      pass,
      visitor,
      hostName,
      qrDataUrl: qrUrl,
      uploadDir: "uploads"
    });

    // update pass with details
    pass.qrData = qrData;
    pass.pdfPath = pdfPath;
    await pass.save();

    res.status(201).json({ pass, qrDataUrl: qrUrl });
  } catch (err) {
    console.log("Error in issuePass:", err.message);
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