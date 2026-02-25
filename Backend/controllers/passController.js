const Joi = require("joi");
const { nanoid } = require("nanoid");
const { Pass } = require("../models/Pass.js");
const { Visitor } = require("../models/Visitor.js");
const { Appointment } = require("../models/Appointment.js");
const { buildQrData, generateQrDataUrl, generatePassPdf } = require("../services/passService.js");

const passSchema = Joi.object({
  visitorId: Joi.string().required(),
  appointmentId: Joi.string().allow("", null),
  validFrom: Joi.date().required(),
  validTo: Joi.date().required(),
});

async function issuePass(req, res, next) {
  try {
    const { value, error } = passSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const visitor = await Visitor.findById(value.visitorId);
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });

    let appointment = null;
    if (value.appointmentId) {
      appointment = await Appointment.findById(value.appointmentId).populate("host", "name");
      if (!appointment) return res.status(404).json({ message: "Appointment not found" });
      if (appointment.status !== "approved") {
        return res.status(400).json({ message: "Appointment not approved" });
      }
    }

    const passCode = `VP-${nanoid(8).toUpperCase()}`;
    const pass = await Pass.create({
      appointment: appointment?._id,
      visitor: visitor._id,
      passCode,
      qrData: "pending",
      issuedBy: req.user?._id,
      validFrom: value.validFrom,
      validTo: value.validTo,
    });

    const qrData = await buildQrData(pass);
    pass.qrData = qrData;
    const qrDataUrl = await generateQrDataUrl(qrData);
    const hostName = appointment?.host?.name || "Walk-in";
    const pdfPath = await generatePassPdf({
      pass,
      visitor,
      hostName,
      qrDataUrl,
      uploadDir: process.env.UPLOAD_DIR || "uploads",
    });
    pass.pdfPath = pdfPath;
    await pass.save();

    res.status(201).json({ pass, qrDataUrl });
  } catch (err) {
    next(err);
  }
}

async function listPasses(req, res, next) {
  try {
    const passes = await Pass.find()
      .populate("visitor")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    res.json(passes);
  } catch (err) {
    next(err);
  }
}

async function getPassByCode(req, res, next) {
  try {
    const pass = await Pass.findOne({ passCode: req.params.code }).populate("visitor").lean();
    if (!pass) return res.status(404).json({ message: "Pass not found" });
    res.json(pass);
  } catch (err) {
    next(err);
  }
}

async function getVisitorPasses(req, res, next) {
  try {
    const visitor = await Visitor.findOne({ email: req.user.email }).lean();
    if (!visitor) return res.status(404).json({ message: "Visitor profile not found" });

    const passes = await Pass.find({ visitor: visitor._id })
      .populate("visitor")
      .populate("appointment")
      .sort({ createdAt: -1 })
      .lean();
    res.json(passes);
  } catch (err) {
    next(err);
  }
}

module.exports = { issuePass, listPasses, getPassByCode, getVisitorPasses };
