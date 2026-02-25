const { User } = require("../models/User.js");
const { Visitor } = require("../models/Visitor.js");
const { hashPassword, signToken, verifyPassword } = require("../utils/auth.js");
const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "security", "host").required(),
});

const visitorRegisterSchema = Joi.object({
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  password: Joi.string().min(6).required(),
  company: Joi.string().allow("", null),
  idNumber: Joi.string().allow("", null),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

async function register(req, res, next) {
  try {
    const { value, error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const existing = await User.findOne({ email: value.email });
    if (existing) return res.status(409).json({ message: "Email already in use" });

    const passwordHash = await hashPassword(value.password);
    const user = await User.create({ ...value, passwordHash });
    const token = signToken(user);
    res.status(201).json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    next(err);
  }
}

async function registerVisitor(req, res, next) {
  try {
    const { value, error } = visitorRegisterSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) return res.status(409).json({ message: "Email already registered" });

    const visitor = await Visitor.create({
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      phone: value.phone,
      company: value.company,
      idNumber: value.idNumber,
    });

    const passwordHash = await hashPassword(value.password);
    const user = await User.create({
      name: `${value.firstName} ${value.lastName}`,
      email: value.email,
      passwordHash,
      role: "visitor",
    });

    const token = signToken(user);
    res.status(201).json({ 
      token, 
      user: { id: user._id, name: user.name, role: user.role, visitorId: visitor._id } 
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { value, error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const user = await User.findOne({ email: value.email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.isActive) return res.status(403).json({ message: "Account deactivated" });

    const ok = await verifyPassword(value.password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    let visitorId = null;
    if (user.role === "visitor") {
      const visitor = await Visitor.findOne({ email: user.email });
      visitorId = visitor?._id;
    }

    const token = signToken(user);
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, visitorId } });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, registerVisitor, login };
