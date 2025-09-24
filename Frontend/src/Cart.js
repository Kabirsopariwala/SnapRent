import React, { useContext } from "react";
import { PreferencesContext } from "./PreferencesContext";

function Cart({ cartItems, user, onBack, onRentNow, onRemoveFromCart }) {
  const { preferences } = useContext(PreferencesContext);

  const formatPrice = (price) => {
    switch (preferences?.currency) {
      case "USD": return `$${price}`;
      case "EUR": return `€${price}`;
      default: return `₹${price}`;
    }
  };

  const handleRemove = async (cartItemId) => {
    if (!user) { alert("⚠️ Please login to remove items from cart."); return; }
    if (onRemoveFromCart) await onRemoveFromCart(cartItemId); // remove by cartItemId
  };

  const handleRentNow = (product) => {
  if (!user) { alert("⚠️ Please login before renting a product."); return; }
  const qty = product.quantity || 1; // get quantity
  if (onRentNow) onRentNow(product, qty); // pass qty
};

  return (
    <div className="container my-4">
      <h2>Your Cart</h2>
      <button className="btn btn-secondary mb-3" onClick={onBack}>← Back</button>

      {cartItems.length === 0 ? <p>Your cart is empty.</p> :
        cartItems.map((product) => {
          const qty = product.quantity || 1;
          const total = product.price * qty;

          return (
            <div key={product.cartItemId} className="border p-3 mb-3 rounded d-flex align-items-center">
              <img src={product.image} alt={product.name} style={{ width: "100px", height: "100px", objectFit: "contain", marginRight: "15px" }} />
              <div style={{ flex: 1 }}>
                <h4>{product.name}</h4>
                <p><strong>Price:</strong> {formatPrice(product.price)} x {qty} = {formatPrice(total)}</p>
                <button className="btn btn-success me-2" onClick={() => handleRentNow(product)}>Rent Now</button>
                <button className="btn btn-danger" onClick={() => handleRemove(product.cartItemId)}>Remove</button>
              </div>
            </div>
          );
        })
      }
    </div>
  );
}

export default Cart;
