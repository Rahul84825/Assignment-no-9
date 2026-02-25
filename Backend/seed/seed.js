const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { User } = require("../models/User.js");
const { Visitor } = require("../models/Visitor.js");
const { Appointment } = require("../models/Appointment.js");
const { Pass } = require("../models/Pass.js");
const { hashPassword } = require("../utils/auth.js");

dotenv.config();

async function seed() {
  console.log("Starting database seed...");
  
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  await Promise.all([
    User.deleteMany({}),
    Visitor.deleteMany({}),
    Appointment.deleteMany({}),
    Pass.deleteMany({}),
  ]);

  const admin = await User.create({
    name: "Admin User",
    email: "admin@example.com",
    passwordHash: await hashPassword("admin123"),
    role: "admin",
  });

  const security = await User.create({
    name: "Front Desk",
    email: "security@example.com",
    passwordHash: await hashPassword("security123"),
    role: "security",
  });

  const host = await User.create({
    name: "Host Employee",
    email: "host@example.com",
    passwordHash: await hashPassword("host123"),
    role: "host",
  });

  const visitorRecord = await Visitor.create({
    firstName: "Jane",
    lastName: "Visitor",
    email: "jane.visitor@example.com",
    phone: "555-0101",
    company: "Acme Corp",
    idNumber: "DL123456",
    createdBy: admin._id,
  });

  const visitorUser = await User.create({
    name: "Jane Visitor",
    email: "jane.visitor@example.com",
    passwordHash: await hashPassword("visitor123"),
    role: "visitor",
  });

  const walkinVisitor = await Visitor.create({
    firstName: "John",
    lastName: "Walkin",
    email: "john.walkin@example.com",
    phone: "555-0102",
    company: "Tech Solutions",
    createdBy: security._id,
  });

  const appointment = await Appointment.create({
    visitor: visitorRecord._id,
    host: host._id,
    purpose: "Project Meeting",
    startTime: new Date(Date.now() + 60 * 60 * 1000),
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
    status: "approved",
    approvedBy: host._id,
  });

  const pendingAppointment = await Appointment.create({
    visitor: walkinVisitor._id,
    host: host._id,
    purpose: "Product Demo",
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 25 * 60 * 60 * 1000),
    status: "pending",
  });

  await Pass.create({
    appointment: appointment._id,
    visitor: visitorRecord._id,
    passCode: "VP-DEMO1234",
    qrData: JSON.stringify({ 
      passCode: "VP-DEMO1234", 
      visitorId: visitorRecord._id.toString(),
      visitorName: "Jane Visitor",
    }),
    issuedBy: security._id,
    validFrom: appointment.startTime,
    validTo: appointment.endTime,
    status: "active",
  });

  await Pass.create({
    visitor: walkinVisitor._id,
    passCode: "VP-WALK5678",
    qrData: JSON.stringify({ 
      passCode: "VP-WALK5678", 
      visitorId: walkinVisitor._id.toString(),
      visitorName: "John Walkin",
    }),
    issuedBy: security._id,
    validFrom: new Date(),
    validTo: new Date(Date.now() + 8 * 60 * 60 * 1000),
    status: "active",
  });

  console.log("\nSeed complete! Login credentials:");
  console.log("Admin:    admin@example.com / admin123");
  console.log("Security: security@example.com / security123");
  console.log("Host:     host@example.com / host123");
  console.log("Visitor:  jane.visitor@example.com / visitor123\n");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
