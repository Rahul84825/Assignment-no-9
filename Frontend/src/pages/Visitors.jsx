import { useEffect, useState } from "react";
import client from "../api/client.js";

export default function Visitors() {
  const [visitors, setVisitors] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    idNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const { data } = await client.get("/visitors");
      setVisitors(data);
    } catch (err) {
      setError("Failed to load visitors");
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
      await client.post("/visitors", form);
      setForm({ 
        firstName: "", 
        lastName: "", 
        email: "", 
        phone: "", 
        company: "",
        idNumber: "",
      });
      setSuccess("Visitor registered successfully!");
      load();
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register visitor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="stack">
      <div className="card">
        <div className="card-title">Register New Visitor</div>
        
        <form className="form-grid" onSubmit={submit}>
          <input
            placeholder="First name *"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            required
          />
          <input
            placeholder="Last name *"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            required
          />
          <input
            placeholder="Email address *"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            placeholder="Phone number"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
          <input
            placeholder="ID Number"
            value={form.idNumber}
            onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
          />
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Register Visitor"}
          </button>
        </form>

        {success && <div className="success">{success}</div>}
        {error && <div className="alert alert-error">{error}</div>}
      </div>

      <div className="card">
        <div className="card-title">Visitor List ({visitors.length})</div>
        
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Company</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((v) => (
              <tr key={v._id}>
                <td>{v.firstName} {v.lastName}</td>
                <td>{v.email}</td>
                <td>{v.phone || "—"}</td>
                <td>{v.company || "—"}</td>
              </tr>
            ))}
            {visitors.length === 0 && (
              <tr>
                <td colSpan="4" className="muted">
                  No visitors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
