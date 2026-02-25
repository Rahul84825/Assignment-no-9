import { useEffect, useState } from "react";
import client from "../api/client.js";
import { sendPassEmail } from "../config/email.js";

export default function Passes() {
  const [passes, setPasses] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [qrPreview, setQrPreview] = useState("");
  const [form, setForm] = useState({
    visitorId: "",
    appointmentId: "",
    validFrom: "",
    validTo: "",
  });

  async function load() {
    const [passRes, visitorRes, apptRes] = await Promise.all([
      client.get("/passes"),
      client.get("/visitors"),
      client.get("/appointments?status=approved"),
    ]);
    setPasses(passRes.data);
    setVisitors(visitorRes.data);
    setAppointments(apptRes.data);
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  async function submit(e) {
    e.preventDefault();
    const { data } = await client.post("/passes", form);
    setQrPreview(data.qrDataUrl);
    
    const visitor = visitors.find(v => v._id === form.visitorId);
    if (visitor?.email) {
      await sendPassEmail(visitor.email, data.pass.passCode, form.validFrom, form.validTo);
    }
    
    setForm({ visitorId: "", appointmentId: "", validFrom: "", validTo: "" });
    load();
  }

  return (
    <div className="stack">
      <div className="card">
        <div className="card-title">Issue Pass</div>
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
            value={form.appointmentId}
            onChange={(e) => setForm({ ...form, appointmentId: e.target.value })}
          >
            <option value="">No Appointment</option>
            {appointments.map((a) => (
              <option key={a._id} value={a._id}>
                {a.visitor?.firstName} {a.visitor?.lastName} -{" "}
                {new Date(a.startTime).toLocaleString()}
              </option>
            ))}
          </select>
          <input
            type="datetime-local"
            value={form.validFrom}
            onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
            required
          />
          <input
            type="datetime-local"
            value={form.validTo}
            onChange={(e) => setForm({ ...form, validTo: e.target.value })}
            required
          />
          <button className="btn primary" type="submit">
            Issue Pass
          </button>
        </form>
        {qrPreview && (
          <div className="qr-preview">
            <img src={qrPreview} alt="QR preview" />
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">Passes</div>
        <table className="table">
          <thead>
            <tr>
              <th>Pass Code</th>
              <th>Visitor</th>
              <th>Valid</th>
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
                <td>
                  {new Date(p.validFrom).toLocaleString()} -{" "}
                  {new Date(p.validTo).toLocaleString()}
                </td>
                <td>{p.status}</td>
              </tr>
            ))}
            {passes.length === 0 && (
              <tr>
                <td colSpan="4" className="muted">
                  No passes issued.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
