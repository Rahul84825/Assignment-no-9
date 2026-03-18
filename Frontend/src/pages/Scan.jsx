import { useState } from "react";
import client from "../api/client.js";

export default function Scan() {
  const [form, setForm] = useState({ passCode: "", action: "check_in", gate: "" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await client.post("/check/scan", form);
      setResult(data.log);
    } catch (err) {
      setResult(null);
      setError(err.response?.data?.message || "Scan failed");
    }
  }

  return (
    <div className="stack">
      <div className="card">
        <div className="card-title">Scan Pass</div>
        <form className="form-grid" onSubmit={submit}>
          <input
            placeholder="Pass Code"
            value={form.passCode}
            onChange={(e) => setForm({ ...form, passCode: e.target.value })}
            required
          />
          <select
            value={form.action}
            onChange={(e) => setForm({ ...form, action: e.target.value })}
          >
            <option value="check_in">Check In</option>
            <option value="check_out">Check Out</option>
          </select>
          <input
            placeholder="Gate (optional)"
            value={form.gate}
            onChange={(e) => setForm({ ...form, gate: e.target.value })}
          />
          <button className="btn primary" type="submit">
            Submit
          </button>
        </form>
        {error && <div className="alert">{error}</div>}
        {result && (
          <div className="success">
            {result.action.replace("_", " ")} recorded at{" "}
            {new Date(result.timestamp).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}
