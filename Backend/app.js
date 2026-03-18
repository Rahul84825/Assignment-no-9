const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./Routes/index.js");

// Initialize Express application
const app = express();

/**
 * Middleware configuration
 */
// Enable Cross-Origin Resource Sharing for all origins
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded data (from forms)
app.use(express.urlencoded({ extended: true }));

/**
 * Static file serving
 * Serving the 'uploads' directory so that QR codes and PDFs can be accessed via URL
 */
const uploadDir = process.env.UPLOAD_DIR || "uploads";
app.use("/uploads", express.static(path.resolve(__dirname, uploadDir)));

/**
 * API Routes
 */
app.use("/api", routes);

/**
 * Health check endpoint
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/**
 * 404 Handler
 * Catch-all for any request that doesn't match a defined route
 */
app.use((req, res) => {
  console.log(`[404] Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: "API Route not found"
  });
});

/**
 * Global Error Handler
 * Centralized error handling for the entire application
 */
app.use((err, req, res, next) => {
  console.error(`[Server Error] ${err.stack}`);
  
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    // Only send error details in development mode
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = app;
