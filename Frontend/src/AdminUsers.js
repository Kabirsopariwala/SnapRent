import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDark.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  async function fetchUsers() {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", { withCredentials: true });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleActive = async (id, active) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${id}/status`,
        { active: !active },
        { withCredentials: true }
      );
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-container">
      <h2>Manage Users</h2>
      <div className="card-grid">
        {users.map((user) => (
          <div className="card" key={user._id}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <div className="card-actions">
              <button
                className={`status-btn ${user.active ? "delivered" : "cancelled"}`}
                onClick={() => toggleActive(user._id, user.active)}
              >
                {user.active ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
