const { User } = require("../models/User.js");

async function listUsers(req, res, next) {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select("name email role").lean();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

module.exports = { listUsers };
