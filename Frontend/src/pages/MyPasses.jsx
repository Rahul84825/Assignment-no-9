import { useEffect, useState } from "react";
import client from "../api/client.js";

export default function MyPasses() {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const { data } = await client.get("/passes/my-passes");
        setPasses(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load passes");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="stack">
        <div className="card">
          <p className="muted">Loading your passes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stack">
        <div className="card">
          <p style={{ color: "red" }}>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stack">
      <div className="card">
        <div className="card-title">My Passes</div>
        {passes.length === 0 ? (
          <p className="muted">You don't have any passes yet.</p>
        ) : (
          <div className="pass-list">
            {passes.map((pass) => (
              <div key={pass._id} className="pass-card">
                <div className="pass-header">
                  <div>
                    <h3 style={{ margin: "0 0 4px 0" }}>Pass: {pass.passCode}</h3>
                    <p style={{ margin: 0, opacity: 0.7, fontSize: "12px" }}>
                      {pass.appointment ? "Appointment Pass" : "Walk-in Pass"}
                    </p>
                  </div>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      background:
                        pass.status === "active"
                          ? "#4CAF50"
                          : pass.status === "expired"
                            ? "#FF9800"
                            : "#F44336",
                      color: "white",
                    }}
                  >
                    {pass.status.toUpperCase()}
                  </span>
                </div>

                <div className="pass-details">
                  <div className="detail-row">
                    <span className="label">Valid From:</span>
                    <span>{new Date(pass.validFrom).toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Valid To:</span>
                    <span>{new Date(pass.validTo).toLocaleString()}</span>
                  </div>
                  {pass.appointment && (
                    <div className="detail-row">
                      <span className="label">Host:</span>
                      <span>
                        {pass.appointment.host?.name || "Unknown"}
                      </span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="label">Issued:</span>
                    <span>{new Date(pass.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {pass.pdfPath && (
                  <div style={{ marginTop: "12px" }}>
                    <a
                      href={`/uploads/${pass.pdfPath.split("/").pop()}`}
                      download
                      className="btn primary"
                      style={{ fontSize: "12px", padding: "6px 12px" }}
                    >
                      📥 Download Pass PDF
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .pass-list {
          display: grid;
          gap: 16px;
          margin-top: 12px;
        }

        .pass-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          background: #fafafa;
        }

        .pass-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e0e0e0;
        }

        .pass-details {
          display: grid;
          gap: 8px;
          font-size: 14px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }

        .label {
          font-weight: 500;
          min-width: 100px;
        }
      `}</style>
    </div>
  );
}
