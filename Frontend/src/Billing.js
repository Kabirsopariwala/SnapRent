// Billing.js
import React, { useState, useContext } from "react";
import { PreferencesContext } from "./PreferencesContext";

function Billing({ product, qty: selectedQty = 1, onOrderPlaced, onBack }) {
  const { preferences } = useContext(PreferencesContext);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [processing, setProcessing] = useState(false);

  if (!product) return <p>No product selected.</p>;

  const qty = selectedQty; // use the qty passed from App.js
  const price = typeof product.price === "string"
    ? parseFloat(product.price.replace(/[^0-9.]/g, ""))
    : product.price;
  const total = price * qty;

  const formatPrice = (price) => {
    switch (preferences?.currency) {
      case "USD": return `$${price}`;
      case "EUR": return `€${price}`;
      default: return `₹${price}`;
    }
  };

  const placeOrder = async (payload) => {
    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ✅ send cookies
      body: JSON.stringify(payload),
    });
    return await res.json();
  };

  const handlePlaceOrderCOD = async () => {
    setProcessing(true);
    try {
      const payload = { productId: product._id, qty, total, paymentMethod: "COD" };
      const order = await placeOrder(payload);
      if (onOrderPlaced) onOrderPlaced(order.order);
      alert("Order placed successfully ✅ (COD)");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to place COD order.");
    }
    setProcessing(false);
  };

  const handleRazorpayPayment = async () => {
    setProcessing(true);
    try {
      const res = await fetch("http://localhost:5000/api/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amount: Math.round(total * 100) }),
      });
      const data = await res.json();
      if (!data.orderId) throw new Error(data.error || "Failed to create Razorpay order");

      const options = {
        key: "rzp_test_RKGbaa9R2w58t5",
        amount: data.amount,
        currency: data.currency,
        name: "SnapRent Store",
        description: product.name,
        order_id: data.orderId,
        handler: async (response) => {
          alert("Payment successful ✅ Payment ID: " + response.razorpay_payment_id);
          const payload = { productId: product._id, qty, total, paymentMethod: "Razorpay", paymentId: response.razorpay_payment_id };
          const order = await placeOrder(payload);
          if (onOrderPlaced) onOrderPlaced(order.order);
        },
        prefill: { name: "Test User", email: "test@example.com", contact: "9999999999" },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert(err.message || "Payment failed ❌");
    }
    setProcessing(false);
  };

  return (
    <div className="container my-4">
      <h2>Billing Details</h2>
      <button className="btn btn-secondary mb-3" onClick={onBack}>← Back</button>

      <div className="border p-3 rounded d-flex">
        <img src={product.image} alt={product.name} style={{ width: "120px", height: "120px", objectFit: "contain", marginRight: "15px" }} />
        <div>
          <h4>{product.name}</h4>
          <p><strong>Price:</strong> {formatPrice(price)} x {qty}</p>
          <h5>Total: {formatPrice(total)}</h5>

          <div className="mt-3">
            <label><input type="radio" value="COD" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} /> COD</label>
            <br />
            <label><input type="radio" value="Razorpay" checked={paymentMethod === "Razorpay"} onChange={() => setPaymentMethod("Razorpay")} /> Razorpay </label>
          </div>

          {paymentMethod === "COD" && <button className="btn btn-primary mt-3" onClick={handlePlaceOrderCOD} disabled={processing}>{processing ? "Processing..." : "Place Order (COD)"}</button>}
          {paymentMethod === "Razorpay" && <button className="btn btn-success mt-3" onClick={handleRazorpayPayment} disabled={processing}>{processing ? "Processing..." : "Pay with Razorpay"}</button>}
        </div>
      </div>
    </div>
  );
}

export default Billing;
