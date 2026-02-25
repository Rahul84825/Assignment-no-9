import { useEffect, useState } from "react";
import client from "../api/client.js";

export default function Reports() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    client
      .get("/reports/summary")
      .then((res) => setSummary(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="stack">
      <div className="card">
        <div className="card-title">Summary</div>
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
        <div className="card-title">Export</div>
        <p className="muted">
          Export endpoints can be added for CSV/PDF reports. This UI is a placeholder.
        </p>
      </div>
    </div>
  );
}
