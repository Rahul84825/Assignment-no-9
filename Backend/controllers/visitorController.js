const { Visitor } = require("../models/Visitor.js");

exports.createVisitor = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, company, idNumber, notes } = req.body;
    const email = String(req.body.email || "").trim().toLowerCase();
    
    // Handle photo upload if present
    let photoUrl = req.body.photoUrl;
    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    }

    // Check if visitor already exists
    const existing = await Visitor.findOne({ email }).lean();
    if (existing) {
      console.warn(`[Visitor Exists] Email: ${email}`);
      return res.status(409).json({ message: "Visitor with this email already exists" });
    }

    // Create visitor record
    const visitor = await Visitor.create({
      firstName,
      lastName,
      email,
      phone,
      company,
      idNumber,
      photoUrl,
      notes,
      createdBy: req.user?._id,
    });

    console.log(`[Visitor Created] ID: ${visitor._id}`);
    return res.status(201).json(visitor);
  } catch (err) {
    console.error(`[Visitor Creation Error] ${err.message}`);
    next(err);
  }
}

exports.listVisitors = async (req, res, next) => {
  try {
    const q = String(req.query.q || "").trim();
    let filter = {};

    if (q) {
      filter = {
        $or: [
          { firstName: new RegExp(q, "i") },
          { lastName: new RegExp(q, "i") },
          { email: new RegExp(q, "i") },
          { phone: new RegExp(q, "i") },
        ],
      };
    }

    const visitors = await Visitor.find(filter).sort({ createdAt: -1 }).limit(200).lean();
    return res.json(visitors);
  } catch (err) {
    next(err);
  }
}

exports.getVisitor = async (req, res, next) => {
  try {
    const visitor = await Visitor.findById(req.params.id).lean();
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });
    return res.json(visitor);
  } catch (err) {
    next(err);
  }
}

