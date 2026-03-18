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
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Use FormData for photo upload as required for file transfers
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });
      if (photo) {
        formData.append("photo", photo);
      }

      const { data } = await client.post("/auth/register-visitor", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setSuccess(true);
      
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
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
          <span>Profile Photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
          <small className="hint">Upload a clear photo for your pass</small>
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
