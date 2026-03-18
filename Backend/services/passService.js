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
  try {
    const fileName = "pass_" + pass.passCode + ".pdf";

    const fullPath = path.join(uploadDir, fileName);

    // create folder if not exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(fullPath);

    doc.pipe(stream);

    // title
    doc.fontSize(18).text("Visitor Pass", { align: "center" });

    doc.moveDown();

    // details
    doc.fontSize(12).text("Pass Code: " + pass.passCode);
    doc.text("Visitor: " + visitor.firstName + " " + visitor.lastName);
    doc.text("Host: " + hostName);

    doc.text("From: " + new Date(pass.validFrom).toLocaleString());
    doc.text("To: " + new Date(pass.validTo).toLocaleString());

    doc.moveDown();

    // add qr image
    if (qrDataUrl) {
      const base64 = qrDataUrl.split(",")[1];
      const buffer = Buffer.from(base64, "base64");

      doc.image(buffer, {
        fit: [100, 100],
        align: "center",
      });
    }

    doc.end();

    // wait for file to save
    await new Promise((resolve) => stream.on("finish", resolve));

    return "/uploads/" + fileName;
  } catch (err) {
    console.log("PDF error:", err.message);
    throw err;
  }
};

module.exports = {
  buildQrData,
  generateQrDataUrl,
  generatePassPdf,
};