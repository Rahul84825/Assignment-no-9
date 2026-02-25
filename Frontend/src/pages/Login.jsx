import { useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client.js";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await client.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <form className="card auth-card" onSubmit={onSubmit}>
        <h1>🏢 Visitor Pass System</h1>
        <p className="muted">Sign in to manage your visits</p>
        
        <label className="field">
          <span>Email Address</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="your.email@example.com"
            required
          />
        </label>
        
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Enter your password"
            required
          />
        </label>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
        
        <div className="divider">
          <span>Demo Accounts</span>
        </div>
        
        <div className="demo-accounts">
          <div className="demo-item">
            <strong>Admin:</strong> admin@example.com / admin123
          </div>
          <div className="demo-item">
            <strong>Security:</strong> security@example.com / security123
          </div>
          <div className="demo-item">
            <strong>Host:</strong> host@example.com / host123
          </div>
        </div>

        <div className="hint">
          First time visitor? <Link to="/visitor-register">Register here</Link>
        </div>
      </form>
    </div>
  );
}
