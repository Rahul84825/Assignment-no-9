const { User } = require("../models/User.js");
const { Visitor } = require("../models/Visitor.js");
const { hashPassword, verifyPassword } = require("../utils/auth.js");
const jwt = require("jsonwebtoken");

// allowed roles
const roles = ["admin", "security", "host"];

// function to generate JWT token
const genToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// register normal users
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const cleanEmail = email.toLowerCase();

    const exists = await User.findOne({ email: cleanEmail });
    if (exists) return res.status(400).json({ message: "Email taken" });

    const hashed = await hashPassword(password);
    const user = await User.create({
      name,
      email: cleanEmail,
      passwordHash: hashed,
      role
    });

    res.status(201).json({
      token: genToken(user),
      user: { id: user._id, name: user.name, role: user.role }
    });
  } catch (err) {
    next(err);
  }
};

// register visitor
exports.registerVisitor = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, company, idNumber } = req.body;
    const cleanEmail = email.toLowerCase();

    const exists = await User.findOne({ email: cleanEmail });
    if (exists) return res.status(400).json({ message: "User exists" });

    const visitor = await Visitor.create({
      firstName,
      lastName,
      email: cleanEmail,
      phone,
      company,
      idNumber,
      photoUrl: req.file ? req.file.path : null
    });

    const hashed = await hashPassword(password);
    const user = await User.create({
      name: `${firstName} ${lastName}`,
      email: cleanEmail,
      passwordHash: hashed,
      role: "visitor"
    });

    res.status(201).json({
      token: genToken(user),
      user: { id: user._id, name: user.name, role: user.role }
    });
  } catch (err) {
    next(err);
  }
};

// login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // check required
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });

    // check user exists
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // check if account active
    if (!user.isActive) {
      return res.status(403).json({
        message: "Account is deactivated",
      });
    }

    // compare password
    const isMatch = await verifyPassword(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    let visitorId = null;

    // if visitor, find visitor record
    if (user.role === "visitor") {
      const visitor = await Visitor.findOne({ email: cleanEmail });
      if (visitor) {
        visitorId = visitor._id;
      }
    }

    // generate token
    const token = genToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        visitorId,
      },
    });
  } catch (err) {
    next(err);
  }
};