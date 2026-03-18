const { User } = require("../models/User.js");
const { Visitor } = require("../models/Visitor.js");
const { hashPassword, verifyPassword } = require("../utils/auth.js");
const jwt = require("jsonwebtoken");

// allowed roles
const roles = ["admin", "security", "host"];

// function to generate JWT token
const genToken = (user) => {
  // payload contains user id and role
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // token valid for 7 days can be changed to whatever number 
  );
};

// register normal users (admin, host, security)
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    // check if email already exists or not
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    // hashing password before saving
    const hashed = await hashPassword(password);

    const user = new User({
      name,
      email: cleanEmail,
      passwordHash: hashed,
      role,
    });

    await user.save();
    console.log(`[User Created] ID: ${user._id}, Role: ${user.role}`);

    // generate JWT token
    const token = genToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(`[Registration Error] ${err.message}`);
    next(err);
  }
};

// register visitor
exports.registerVisitor = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, company, idNumber } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    // check if already registered
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // get uploaded file
    const photo = req.file ? req.file.path : null;

    const visitor = new Visitor({
      firstName,
      lastName,
      email: cleanEmail,
      phone,
      company,
      idNumber,
      photo, // save image path
    });

    await visitor.save();

    // create user login for visitor
    const hashed = await hashPassword(password);

    const user = new User({
      name: firstName + " " + lastName,
      email: cleanEmail,
      passwordHash: hashed,
      role: "visitor",
    });

    await user.save();

    // generate token
    const token = genToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        visitorId: visitor._id,
      },
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