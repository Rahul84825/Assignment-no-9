const { User } = require("../models/User.js");

exports.listUsers = async (req, res, next) => {
  try {
    const role = req.query.role;
    let filter = {};

    if (role) {
      if (role === "admin" || role === "host" || role === "security") {
        filter.role = role;
      } else {
        return res.status(400).json({
          message: "Role should be admin, host, or security",
        });
      }
    }

    const users = await User.find(filter).select("name email role").lean();

    if (!users || users.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

