import { useEffect, useState } from "react";
import client from "../api/client.js";
import { sendAppointmentEmail } from "../config/email.js";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [hosts, setHosts] = useState([]);
  const [form, setForm] = useState({
    visitorId: "",
    hostId: "",
    purpose: "",
    startTime: "",
    endTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const [appRes, visitorRes, hostRes] = await Promise.all([
        client.get("/appointments"),
        client.get("/visitors"),
        client.get("/users?role=host"),
      ]);
      setAppointments(appRes.data);
      setVisitors(visitorRes.data);
      setHosts(hostRes.data);
    } catch (err) {
      setError("Failed to load data");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await client.post("/appointments", form);
      
      const visitor = visitors.find((v) => v._id === form.visitorId);
      const host = hosts.find((h) => h._id === form.hostId);
      if (visitor && host) {
        try {
          await sendAppointmentEmail({
            toEmail: visitor.email,
            visitorName: `${visitor.firstName} ${visitor.lastName}`,
            hostName: host.name,
            startTime: new Date(form.startTime).toLocaleString(),
          });
        } catch (emailErr) {
          console.log("Email failed:", emailErr);
        }
      }
      
      setForm({ visitorId: "", hostId: "", purpose: "", startTime: "", endTime: "" });
      setSuccess("Appointment created successfully!");
      load();
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create appointment");
    } finally {
      setLoading(false);
    }
  }

  async function approve(id) {
    try {
      await client.post(`/appointments/${id}/approve`);
      
      const appt = appointments.find(a => a._id === id);
      if (appt?.visitor?.email) {
        await sendAppointmentEmail(appt.visitor.email, "approved", appt.purpose, appt.startTime);
      }
      
      setSuccess("Appointment approved!");
      load();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to approve appointment");
    }
  }

  async function reject(id) {
    try {
      await client.post(`/appointments/${id}/reject`);
      
      const appt = appointments.find(a => a._id === id);
      if (appt?.visitor?.email) {
        await sendAppointmentEmail(appt.visitor.email, "rejected", appt.purpose, appt.startTime);
      }
      
      setSuccess("Appointment rejected");
      load();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to reject appointment");
    }
  }

  return (
    <div className="stack">
      {success && <div className="success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="card-title">Create Appointment</div>
        
        <form className="form-grid" onSubmit={submit}>
          <select
            value={form.visitorId}
            onChange={(e) => setForm({ ...form, visitorId: e.target.value })}
            required
          >
            <option value="">Select Visitor</option>
            {visitors.map((v) => (
              <option key={v._id} value={v._id}>
                {v.firstName} {v.lastName}
              </option>
            ))}
          </select>
          
          <select
            value={form.hostId}
            onChange={(e) => setForm({ ...form, hostId: e.target.value })}
            required
          >
            <option value="">Select Host</option>
            {hosts.map((h) => (
              <option key={h._id} value={h._id}>
                {h.name}
              </option>
            ))}
          </select>
          
          <input
            placeholder="Purpose of visit"
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            required
          />
          
          <input
            type="datetime-local"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            required
          />
          
          <input
            type="datetime-local"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            required
          />
          
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Appointment"}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-title">Appointments ({appointments.length})</div>
        
        <table className="table">
          <thead>
            <tr>
              <th>Visitor</th>
              <th>Host</th>
              <th>Purpose</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a._id}>
                <td>
                  {a.visitor?.firstName} {a.visitor?.lastName}
                </td>
                <td>{a.host?.name}</td>
                <td>{a.purpose}</td>
                <td>
                  {new Date(a.startTime).toLocaleString()}
                </td>
                <td>{a.status}</td>
                <td>
                  {a.status === "pending" && (
                    <div className="row">
                      <button className="btn primary" onClick={() => approve(a._id)}>
                        Approve
                      </button>
                      <button className="btn ghost" onClick={() => reject(a._id)}>
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan="6" className="muted">
                  No appointments yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
