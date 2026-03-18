const jwt = require("jsonwebtoken");
const { User } = require("../models/User.js");

// middleware to check if user is logged in
const requireAuth = async (req, res, next) => {
  try {
    let token = null;

    // check authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      // format: Bearer token
      token = req.headers.authorization.split(" ")[1];
    }

    // if no token found
    if (!token) {
      return res.status(401).json({
        message: "Token not provided",
      });
    }

    // verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded contains payload (id and role)
    const user = await User.findById(decoded.id);

    // check if user exists and is active
    if (!user || !user.isActive) {
      return res.status(401).json({
        message: "Invalid user",
      });
    }

    // attach user to request
    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized access",
    });
  }
};

// middleware for role-based access
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // check if user exists
    if (!req.user) {
      return res.status(401).json({
        message: "User not logged in",
      });
    }

    // check if role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };
};

module.exports = { requireAuth, requireRole };