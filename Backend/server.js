const dotenv = require("dotenv");
const app = require("./app.js");
const { connectDb } = require("./config/db.js");
const { ensureUploadDir } = require("./utils/fs.js");

dotenv.config();

// validate env variables
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is missing");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing");
  process.exit(1);
}

const port = process.env.PORT || 5000;

async function start() {
  await connectDb(process.env.MONGODB_URI);
  ensureUploadDir(process.env.UPLOAD_DIR || "uploads");

  app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
  });
}
 
start().catch((err) => {
  console.error("Failed to start server", err);
});
