const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");

// create qr data (string)
const buildQrData = async (pass) => {
  // converting pass details into string
  const data = {
    passCode: pass.passCode,
    visitorId: pass.visitor.toString(),
  };

  return JSON.stringify(data);
};

// generate qr image (base64)
const generateQrDataUrl = async (qrData) => {
  try {
    const qr = await QRCode.toDataURL(qrData);
    return qr;
  } catch (err) {
    console.log("QR generation error:", err.message);
    throw err;
  }
};

// generate pdf pass
const generatePassPdf = async ({ pass, visitor, hostName, qrDataUrl, uploadDir }) => {
  return new Promise((resolve, reject) => {
    try {
      const fileName = "pass_" + pass.passCode + ".pdf";
      const fullPath = path.join(uploadDir, fileName);

      // create folder if not exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const doc = new PDFDocument();
      const stream = fs.createWriteStream(fullPath);

      stream.on("error", (err) => {
        console.log("Stream error:", err);
        reject(err);
      });

      stream.on("finish", () => {
        resolve("/uploads/" + fileName);
      });

      doc.pipe(stream);

      // add content
      doc.fontSize(20).text("Visitor Pass", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text("Pass Code: " + pass.passCode);
      doc.text("Visitor: " + visitor.firstName + " " + visitor.lastName);
      doc.text("Host: " + hostName);
      doc.text("From: " + new Date(pass.validFrom).toLocaleString());
      doc.text("To: " + new Date(pass.validTo).toLocaleString());

      if (qrDataUrl) {
        const base64 = qrDataUrl.split(",")[1];
        const buffer = Buffer.from(base64, "base64");
        doc.moveDown();
        doc.image(buffer, { fit: [100, 100], align: "center" });
      }

      doc.end();
    } catch (err) {
      console.log("PDF error:", err);
      reject(err);
    }
  });
};

module.exports = {
  buildQrData,
  generateQrDataUrl,
  generatePassPdf,
};