import { useEffect, useState } from "react";
import client from "../api/client.js";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [passes, setPasses] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    async function load() {
      try {
        const [summaryRes, passesRes] = await Promise.all([
          client.get("/reports/summary"),
          client.get("/passes"),
        ]);
        setSummary(summaryRes.data);
        setPasses(passesRes.data.slice(0, 6));
      } catch (err) {
        console.error("Failed to load", err);
      }
    }
    load();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="stack">
      {user && (
        <div className="card" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", border: "none" }}>
          <h2 style={{ margin: "0 0 8px 0" }}>
            {getGreeting()}, {user.name}!
          </h2>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Welcome to the Visitor Pass Management System
          </p>
        </div>
      )}

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

      <div className="card">
        <div className="card-title">Recent Passes</div>
        
        <table className="table">
          <thead>
            <tr>
              <th>Pass Code</th>
              <th>Visitor</th>
              <th>Valid Until</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {passes.map((p) => (
              <tr key={p._id}>
                <td>{p.passCode}</td>
                <td>
                  {p.visitor?.firstName} {p.visitor?.lastName}
                </td>
                <td>{new Date(p.validTo).toLocaleString()}</td>
                <td>{p.status}</td>
              </tr>
            ))}
            {passes.length === 0 && (
              <tr>
                <td colSpan="4" className="muted">
                  No passes yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
