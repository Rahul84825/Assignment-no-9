import { useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client.js";

export default function VisitorRegister() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    company: "",
    idNumber: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const { data } = await client.post("/auth/register-visitor", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        company: form.company,
        idNumber: form.idNumber,
      });

      localStorage.setItem("token", data.token);
      setSuccess(true);
      
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  }

  if (success) {
    return (
      <div className="auth-shell">
        <div className="card auth-card">
          <h1>✓ Registration Successful!</h1>
          <p>Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <form className="card auth-card" onSubmit={onSubmit}>
        <h1>Visitor Registration</h1>
        <p className="muted">Create your account to pre-register for visits</p>

        <div className="form-row">
          <label className="field">
            <span>First Name *</span>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              placeholder="John"
              required
            />
          </label>

          <label className="field">
            <span>Last Name *</span>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              placeholder="Doe"
              required
            />
          </label>
        </div>

        <label className="field">
          <span>Email Address *</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="john.doe@example.com"
            required
          />
        </label>

        <label className="field">
          <span>Phone Number *</span>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
            required
          />
        </label>

        <label className="field">
          <span>Company/Organization</span>
          <input
            type="text"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="Acme Corporation"
          />
        </label>

        <label className="field">
          <span>ID Number (Optional)</span>
          <input
            type="text"
            value={form.idNumber}
            onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
            placeholder="Driver's License or Passport Number"
          />
          <small className="hint">For security verification</small>
        </label>

        <label className="field">
          <span>Password *</span>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Minimum 6 characters"
            required
            minLength={6}
          />
        </label>

        <label className="field">
          <span>Confirm Password *</span>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            placeholder="Re-enter your password"
            required
          />
        </label>

        {error && <div className="alert alert-error">{error}</div>}

        <button className="btn primary" type="submit">
          Create Account
        </button>

        <div className="hint">
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>
      </form>
    </div>
  );
}
