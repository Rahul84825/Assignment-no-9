const Joi = require("joi");

/**
 * Generic validation middleware using Joi
 * @param {Joi.ObjectSchema} schema - The Joi schema to validate against
 * @returns {Function} Express middleware function
 */
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false, // Return all errors, not just the first one
    allowUnknown: true, // Allow fields not in the schema (e.g., fields handled by other middleware)
    stripUnknown: true, // Remove unknown fields from req.body
  });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message.replace(/"/g, ""))
      .join(", ");
    
    // Log the validation error for debugging purposes
    console.warn(`[Validation Error] ${req.method} ${req.originalUrl}: ${errorMessage}`);
    
    return res.status(400).json({ 
      success: false,
      message: "Validation error", 
      errors: errorMessage 
    });
  }

  next();
};

module.exports = validate;
