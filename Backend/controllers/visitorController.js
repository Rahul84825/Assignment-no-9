const { Visitor } = require("../models/Visitor.js");
const Joi = require("joi");

const visitorSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow("", null),
  company: Joi.string().allow("", null),
  idNumber: Joi.string().allow("", null),
  photoUrl: Joi.string().allow("", null),
  notes: Joi.string().allow("", null),
});

async function createVisitor(req, res, next) {
  try {
    const { value, error } = visitorSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const visitor = await Visitor.create({ ...value, createdBy: req.user?._id });
    res.status(201).json(visitor);
  } catch (err) {
    next(err);
  }
}

async function listVisitors(req, res, next) {
  try {
    const { q } = req.query;
    const filter = q
      ? {
          $or: [
            { firstName: new RegExp(q, "i") },
            { lastName: new RegExp(q, "i") },
            { email: new RegExp(q, "i") },
            { phone: new RegExp(q, "i") },
          ],
        }
      : {};
    const visitors = await Visitor.find(filter).sort({ createdAt: -1 }).limit(200).lean();
    res.json(visitors);
  } catch (err) {
    next(err);
  }
}

async function getVisitor(req, res, next) {
  try {
    const visitor = await Visitor.findById(req.params.id).lean();
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });
    res.json(visitor);
  } catch (err) {
    next(err);
  }
}

module.exports = { createVisitor, listVisitors, getVisitor };
