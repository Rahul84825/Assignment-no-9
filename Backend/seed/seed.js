const dotenv = require("dotenv");
const mongoose = require("mongoose");

const { User } = require("../models/User.js");
const { Visitor } = require("../models/Visitor.js");
const { Appointment } = require("../models/Appointment.js");
const { Pass } = require("../models/Pass.js");

const { hashPassword } = require("../utils/auth.js");

dotenv.config();

// main function to insert demo data
const seedData = async () => {
  try {
    console.log("Seeding started...");

    // connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connected");

    // clear old data
    await User.deleteMany({});
    await Visitor.deleteMany({});
    await Appointment.deleteMany({});
    await Pass.deleteMany({});

    // create users (admin, security, host)
    const admin = new User({
      name: "Admin",
      email: "admin@test.com",
      passwordHash: await hashPassword("admin123"),
      role: "admin",
    });
    await admin.save();

    const security = new User({
      name: "Security",
      email: "security@test.com",
      passwordHash: await hashPassword("security123"),
      role: "security",
    });
    await security.save();

    const host = new User({
      name: "Host",
      email: "host@test.com",
      passwordHash: await hashPassword("host123"),
      role: "host",
    });
    await host.save();

    // create visitor
    const visitor = new Visitor({
      firstName: "Rahul",
      lastName: "Visitor",
      email: "rahul@test.com",
      phone: "9999999999",
      company: "Demo Company",
      createdBy: admin._id,
    });
    await visitor.save();

    // create visitor login user
    const visitorUser = new User({
      name: "Rahul Visitor",
      email: "rahul@test.com",
      passwordHash: await hashPassword("visitor123"),
      role: "visitor",
    });
    await visitorUser.save();

    // create appointment
    const appointment = new Appointment({
      visitor: visitor._id,
      host: host._id,
      purpose: "Meeting",
      startTime: new Date(Date.now() + 60 * 60 * 1000),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      status: "approved",
      approvedBy: host._id,
    });
    await appointment.save();

    // create pass
    const pass = new Pass({
      visitor: visitor._id,
      appointment: appointment._id,
      passCode: "VP-DEMO1",
      qrData: JSON.stringify({
        passCode: "VP-DEMO1",
        visitorId: visitor._id.toString(),
      }),
      issuedBy: security._id,
      validFrom: appointment.startTime,
      validTo: appointment.endTime,
      status: "active",
    });
    await pass.save();

    console.log("Seeding done!");
    console.log("Login credentials:");
    console.log("Admin: admin@test.com / admin123");
    console.log("Security: security@test.com / security123");
    console.log("Host: host@test.com / host123");
    console.log("Visitor: rahul@test.com / visitor123");

    // disconnect DB
    await mongoose.disconnect();
  } catch (err) {
    console.log("Error while seeding:", err.message);
    process.exit(1);
  }
};

// run function
seedData();