import React, { useEffect, useState } from "react";
import axios from "axios";

function Orders({ user, onBack }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders", {
          withCredentials: true,
        });
        console.log("Fetched orders:", res.data);
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
        withCredentials: true,
      });
      setOrders(orders.filter((o) => o._id !== orderId));
      alert("Order cancelled ✅");
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert("Failed to cancel order. Try again.");
    }
  };

  if (!user) {
    return (
      <div className="container my-4">
        <h2>Please login to see your orders.</h2>
        <button className="btn btn-secondary mt-3" onClick={onBack}>
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <h2>Your Orders</h2>
      <button className="btn btn-secondary mb-3" onClick={onBack}>
        ← Back
      </button>

      {loading ? (
        <p>Loading your orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        orders.map((order, index) => (
          <div key={index} className="border p-3 mb-3 rounded d-flex justify-content-between align-items-center">
            <div className="d-flex">
              <img
                src={order.product.image}
                alt={order.product.name}
                style={{ width: "100px", height: "100px", objectFit: "contain", marginRight: "15px" }}
              />
              <div>
                <h4>{order.product.name}</h4>
                <p><strong>Qty:</strong> {order.qty}</p>
                <p><strong>Total:</strong> ₹{order.total}</p>
                <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
                <p><strong>Status:</strong> {order.status}</p>
              </div>
            </div>
            {order.status !== "Cancelled" && order.status !== "Delivered" && (
  <button
    className="btn btn-danger"
    onClick={() => handleCancelOrder(order._id)}
  >
    Cancel Order
  </button>
)}

          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
