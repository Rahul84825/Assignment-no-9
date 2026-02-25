import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const adminLinks = [
  { to: "/", label: "Dashboard" },
  { to: "/visitors", label: "Visitors" },
  { to: "/appointments", label: "Appointments" },
  { to: "/passes", label: "Passes" },
  { to: "/scan", label: "Scan" },
  { to: "/reports", label: "Reports" },
];

const visitorLinks = [
  { to: "/", label: "Dashboard" },
  { to: "/my-passes", label: "My Passes" },
];

export default function Layout() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const links = user?.role === "visitor" ? visitorLinks : adminLinks;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">VP</div>
          <div>
            <div className="brand-title">Visitor Pass</div>
            <div className="brand-sub">Management</div>
          </div>
        </div>
        <nav className="nav">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className="nav-link" end>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main">
        <header className="topbar">
          <div>
            <div className="page-title">Visitor Pass System</div>
            <div className="page-sub">
              {user?.role === "visitor" ? "View your digital passes" : "Secure, fast check-ins"}
            </div>
          </div>
          <button
            className="btn ghost"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
