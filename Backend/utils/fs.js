const fs = require("fs");
const path = require("path");

function ensureUploadDir(dir) {
  const target = path.resolve(dir);

  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
}

module.exports = { ensureUploadDir };
