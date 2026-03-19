const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./Routes/index.js");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serving uploaded files (QR, PDF etc)
const uploadDir = process.env.UPLOAD_DIR || "uploads";
app.use("/uploads", express.static(path.resolve(__dirname, uploadDir)));

// api routes
app.use("/api", routes);

// health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

module.exports = app;
