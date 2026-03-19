const { Pass } = require("../models/Pass.js");
const { CheckLog } = require("../models/CheckLog.js");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");

// Get Summary
exports.getSummary = async (req, res, next) => {
  try {
    const totalPasses = await Pass.countDocuments();
    const totalCheckIns = await CheckLog.countDocuments({ action: "check_in" });
    const totalCheckOuts = await CheckLog.countDocuments({ action: "check_out" });

    return res.json({
      totalPasses,
      totalCheckIns,
      totalCheckOuts,
    });
  } catch (err) {
    next(err);
  }
};

// Exports CSV
exports.exportCSV = async (req, res, next) => {
  try {
    const logs = await CheckLog.find()
      .populate("visitor", "firstName lastName email")
      .populate("pass", "passCode")
      .sort({ timestamp: -1 })
      .lean();

    const data = logs.map((log) => ({
      Timestamp: new Date(log.timestamp).toLocaleString(),
      Visitor: `${log.visitor?.firstName || ""} ${log.visitor?.lastName || ""}`,
      Email: log.visitor?.email || "",
      PassCode: log.pass?.passCode || "",
      Action: log.action.replace("_", " ").toUpperCase(),
      Gate: log.gate || "N/A",
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment(`vms_logs_${Date.now()}.csv`);
    return res.send(csv);
  } catch (err) {
    next(err);
  }
};

// exports PDF
exports.exportPDF = async (req, res, next) => {
  try {
    const logs = await CheckLog.find()
      .populate("visitor", "firstName lastName")
      .populate("pass", "passCode")
      .sort({ timestamp: -1 });

    const doc = new PDFDocument();
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=report-${Date.now()}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text("Visitor Log Report", { align: "center" });
    doc.moveDown();

    logs.forEach((log) => {
      const visitorName = log.visitor ? `${log.visitor.firstName} ${log.visitor.lastName}` : "Unknown";
      const passCode = log.pass ? log.pass.passCode : "N/A";
      
      doc.fontSize(12).text(`Time: ${new Date(log.timestamp).toLocaleString()}`);
      doc.text(`Visitor: ${visitorName}`);
      doc.text(`Pass: ${passCode}`);
      doc.text(`Action: ${log.action.toUpperCase()}`);
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    next(err);
  }
};
