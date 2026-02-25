const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");

async function buildQrData(pass) {
  return JSON.stringify({
    passCode: pass.passCode,
    visitorId: pass.visitor.toString(),
  });
}

async function generateQrDataUrl(qrData) {
  return QRCode.toDataURL(qrData, { width: 300, margin: 1 });
}

async function generatePassPdf({ pass, visitor, hostName, qrDataUrl, uploadDir }) {
  const fileName = `pass_${pass.passCode}.pdf`;
  const pdfPath = path.resolve(uploadDir, fileName);

  const doc = new PDFDocument({ size: "A6", margin: 20 });
  const stream = fs.createWriteStream(pdfPath);
  doc.pipe(stream);

  doc.fontSize(16).text("Visitor Pass", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(10).text(`Pass Code: ${pass.passCode}`);
  doc.text(`Visitor: ${visitor.firstName} ${visitor.lastName}`);
  if (visitor.company) doc.text(`Company: ${visitor.company}`);
  doc.text(`Host: ${hostName}`);
  doc.text(`Valid From: ${new Date(pass.validFrom).toLocaleString()}`);
  doc.text(`Valid To: ${new Date(pass.validTo).toLocaleString()}`);
  doc.moveDown(0.5);

  if (qrDataUrl) {
    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, "");
    const imgBuffer = Buffer.from(base64Data, "base64");
    doc.image(imgBuffer, { fit: [120, 120], align: "center" });
  }

  doc.end();

  await new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  return pdfPath;
}

module.exports = { buildQrData, generateQrDataUrl, generatePassPdf };
