import { useEffect, useState } from "react";
import client from "../api/client.js";

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [exporting, setExporting] = useState(null);

  useEffect(() => {
    client
      .get("/reports/summary")
      .then((res) => setSummary(res.data))
      .catch(() => {});
  }, []);

  const handleExport = async (type) => {
    try {
      setExporting(type);
      const response = await client.get(`/reports/export/${type}`, {
        responseType: "blob",
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `vms_report_${Date.now()}.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(`Export failed: ${err.message}`);
      alert("Failed to export report. Please try again.");
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="stack">
      <div className="card">
        <div className="card-title">Dashboard Summary</div>
        <div className="grid-3">
          <div className="stat-card">
            <div className="stat-label">Total Passes</div>
            <div className="stat-value">{summary?.totalPasses ?? "—"}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Check-ins</div>
            <div className="stat-value">{summary?.totalCheckIns ?? "—"}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Check-outs</div>
            <div className="stat-value">{summary?.totalCheckOuts ?? "—"}</div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-title">Export Reports</div>
        <p className="muted" style={{ marginBottom: "1rem" }}>
          Download detailed logs of visitor check-ins and check-outs in your preferred format.
        </p>
        <div className="row" style={{ gap: "1rem" }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => handleExport("csv")}
            disabled={exporting !== null}
          >
            {exporting === "csv" ? "Exporting..." : "Download CSV"}
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => handleExport("pdf")}
            disabled={exporting !== null}
          >
            {exporting === "pdf" ? "Exporting..." : "Download PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
