import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDark.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const statuses = ["Placed", "Shipped", "Delivered", "Cancelled"];

  async function fetchOrders() {
    const res = await axios.get("http://localhost:5000/api/admin/orders", { withCredentials: true });
    setOrders(res.data);
  }

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/orders/${id}/status`,
        { status },
        { withCredentials: true }
      );
      fetchOrders();
    } catch (err) { console.error(err); }
  };

const deleteOrder = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/admin/orders/${id}`, { withCredentials: true });
    fetchOrders(); // refresh list after deletion
  } catch (err) {
    console.error(err);
  }
};


  return (
    <div className="admin-container">
      <h2>Orders</h2>
      <div className="card-grid">
        {orders.map(o => (
          <div className="card" key={o._id}>
            <h3>{o.product.name}</h3>
           <p><strong>User:</strong> {o.userName}</p>
            <p><strong>Qty:</strong> {o.qty}</p>
            <p><strong>Total:</strong> ₹{o.total}</p>
            <p><strong>Status:</strong> {o.status}</p>
            <div className="card-actions">
              {statuses.map(s => (
                <button
                  key={s}
                  className={`status-btn ${s.toLowerCase()}`}
                  onClick={() => updateStatus(o._id, s)}
                >
                  {s}
                </button>
              ))}
               <button
    className="status-btn cancelled"
    onClick={() => deleteOrder(o._id)}
  >
    Cancel
  </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
