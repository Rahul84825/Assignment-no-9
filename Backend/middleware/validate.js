const Joi = require("joi");

// validation middleware to check req.body against schema
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    const msg = error.details.map((d) => d.message).join(", ");
    return res.status(400).json({ message: msg });
  }

  next();
};

module.exports = validate;
