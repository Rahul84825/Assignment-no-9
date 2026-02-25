import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import VisitorRegister from "./pages/VisitorRegister.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Visitors from "./pages/Visitors.jsx";
import Appointments from "./pages/Appointments.jsx";
import Passes from "./pages/Passes.jsx";
import MyPasses from "./pages/MyPasses.jsx";
import Scan from "./pages/Scan.jsx";
import Reports from "./pages/Reports.jsx";
import "./App.css";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/visitor-register" element={<VisitorRegister />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="visitors" element={<Visitors />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="passes" element={<Passes />} />
          <Route path="my-passes" element={<MyPasses />} />
          <Route path="scan" element={<Scan />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
