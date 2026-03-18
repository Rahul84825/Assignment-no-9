const Joi = require("joi");

/**
 * Validation schemas for various entities in the system.
 * These schemas ensure incoming request bodies match the expected structure
 * and contain valid data types, improving system reliability and security.
 */

// User authentication/registration schemas
const authSchemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      "string.min": "Name must be at least 2 characters long",
      "any.required": "Name is a required field"
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address"
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long"
    }),
    role: Joi.string().valid("admin", "security", "host", "visitor").required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

// Visitor management schemas
const visitorSchemas = {
  create: Joi.object({
    firstName: Joi.string().required().trim(),
    lastName: Joi.string().required().trim(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow("", null),
    company: Joi.string().allow("", null),
    idNumber: Joi.string().allow("", null),
    notes: Joi.string().allow("", null)
  }),
  
  update: Joi.object({
    firstName: Joi.string().trim(),
    lastName: Joi.string().trim(),
    email: Joi.string().email(),
    phone: Joi.string().allow("", null),
    company: Joi.string().allow("", null),
    idNumber: Joi.string().allow("", null),
    notes: Joi.string().allow("", null)
  })
};

// Appointment management schemas
const appointmentSchemas = {
  create: Joi.object({
    visitorId: Joi.string().hex().length(24).required().messages({
      "string.length": "Invalid Visitor ID format"
    }),
    hostId: Joi.string().hex().length(24).required(),
    purpose: Joi.string().required().min(3),
    startTime: Joi.date().iso().required(),
    endTime: Joi.date().iso().greater(Joi.ref("startTime")).required()
  }),
  
  updateStatus: Joi.object({
    status: Joi.string().valid("approved", "rejected", "cancelled").required()
  })
};

// Pass issuance schemas
const passSchemas = {
  issue: Joi.object({
    visitorId: Joi.string().hex().length(24).required(),
    appointmentId: Joi.string().hex().length(24).allow(null, ""),
    validFrom: Joi.date().iso().required(),
    validTo: Joi.date().iso().greater(Joi.ref("validFrom")).required()
  })
};

module.exports = {
  authSchemas,
  visitorSchemas,
  appointmentSchemas,
  passSchemas
};
