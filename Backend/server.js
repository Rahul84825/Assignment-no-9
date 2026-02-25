const dotenv = require("dotenv");
const app = require("./app.js");
const { connectDb } = require("./config/db.js");
const { ensureUploadDir } = require("./utils/fs.js");

dotenv.config();

const port = process.env.PORT;

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
