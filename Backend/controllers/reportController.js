const { Pass } = require("../models/Pass.js");
const { CheckLog } = require("../models/CheckLog.js");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");

/**
 * Get dashboard summary statistics
 */
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

/**
 * Export logs as CSV
 */
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

/**
 * Export logs as PDF
 */
exports.exportPDF = async (req, res, next) => {
  try {
    const logs = await CheckLog.find()
      .populate("visitor", "firstName lastName email")
      .populate("pass", "passCode")
      .sort({ timestamp: -1 })
      .lean();

    const doc = new PDFDocument({ margin: 30, size: "A4" });
    
    res.header("Content-Type", "application/pdf");
    res.attachment(`vms_report_${Date.now()}.pdf`);
    doc.pipe(res);

    // Title
    doc.fontSize(20).text("Visitor Management System - Log Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: "right" });
    doc.moveDown();

    // Table Header
    const tableTop = 150;
    doc.font("Helvetica-Bold");
    doc.text("Timestamp", 30, tableTop);
    doc.text("Visitor Name", 150, tableTop);
    doc.text("Pass Code", 300, tableTop);
    doc.text("Action", 400, tableTop);
    doc.text("Gate", 500, tableTop);
    
    doc.moveTo(30, tableTop + 15).lineTo(560, tableTop + 15).stroke();
    doc.font("Helvetica");

    let y = tableTop + 25;
    logs.forEach((log) => {
      if (y > 750) {
        doc.addPage();
        y = 50;
      }
      
      doc.fontSize(9);
      doc.text(new Date(log.timestamp).toLocaleString(), 30, y);
      doc.text(`${log.visitor?.firstName || ""} ${log.visitor?.lastName || ""}`, 150, y);
      doc.text(log.pass?.passCode || "", 300, y);
      doc.text(log.action.toUpperCase(), 400, y);
      doc.text(log.gate || "N/A", 500, y);
      
      y += 20;
    });

    doc.end();
  } catch (err) {
    next(err);
  }
};
