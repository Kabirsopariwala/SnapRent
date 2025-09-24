// AdminApp.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminDashboard from "./AdminDashboard";
import AdminProducts from "./AdminProducts";
import AdminUsers from "./AdminUsers";
import AdminCategories from "./AdminCategories";
import AdminOrders from "./AdminOrders";

export default function AdminApp() {
  const [page, setPage] = useState("dashboard");
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Check if admin is already logged in via session/cookie
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/me", { withCredentials: true })
      .then((res) => setAdminUser(res.data.user))
      .catch(() => setAdminUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/login",
        { email, password },
        { withCredentials: true }
      );
      setAdminUser(res.data.user);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  const handleLogout = () => {
    axios
      .post("http://localhost:5000/api/admin/logout", {}, { withCredentials: true })
      .then(() => setAdminUser(null));
  };

  if (loading) return <p>Loading...</p>;

  // Show login form if admin not logged in
  if (!adminUser) {
    return (
      <div style={{ maxWidth: 400, margin: "100px auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
        <h2>Admin Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 10 }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 10 }}
            required
          />
          <button type="submit" style={{ width: "100%", padding: 10 }}>Login</button>
        </form>
      </div>
    );
  }

  // Show admin panel if logged in
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "220px", background: "#222", color: "#fff", padding: "20px" }}>
        <h2>Admin Panel</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ margin: "10px 0", cursor: "pointer" }} onClick={() => setPage("dashboard")}>Dashboard</li>
          <li style={{ margin: "10px 0", cursor: "pointer" }} onClick={() => setPage("products")}>Products</li>
          <li style={{ margin: "10px 0", cursor: "pointer" }} onClick={() => setPage("users")}>Users</li>
          <li style={{ margin: "10px 0", cursor: "pointer" }} onClick={() => setPage("categories")}>Categories</li>
          <li style={{ margin: "10px 0", cursor: "pointer" }} onClick={() => setPage("orders")}>Orders</li>
          <li style={{ margin: "20px 0", cursor: "pointer", color: "#f88" }} onClick={handleLogout}>Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", background: "black" }}>
        {page === "dashboard" && <AdminDashboard />}
        {page === "products" && <AdminProducts />}
        {page === "users" && <AdminUsers />}
        {page === "categories" && <AdminCategories />}
        {page === "orders" && <AdminOrders />}
      </div>
    </div>
  );
}
