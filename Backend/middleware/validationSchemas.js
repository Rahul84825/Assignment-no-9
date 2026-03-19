const Joi = require("joi");

// User login and register validation
const authSchemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("admin", "security", "host", "visitor").required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

// Visitor validation
const visitorSchemas = {
  create: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow("", null),
    company: Joi.string().allow("", null),
    idNumber: Joi.string().allow("", null),
    notes: Joi.string().allow("", null),
    password: Joi.string().min(6)
  })
};

// Appointment validation
const appointmentSchemas = {
  create: Joi.object({
    visitorId: Joi.string().required(),
    hostId: Joi.string().required(),
    purpose: Joi.string().required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required()
  })
};

// Pass validation
const passSchemas = {
  issue: Joi.object({
    visitorId: Joi.string().required(),
    appointmentId: Joi.string().allow(null, ""),
    validFrom: Joi.date().required(),
    validTo: Joi.date().required()
  })
};

module.exports = {
  authSchemas,
  visitorSchemas,
  appointmentSchemas,
  passSchemas
};
