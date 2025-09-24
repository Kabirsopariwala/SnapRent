import React from "react";

function ProductDetails({ product, user, onBack, onAddToCart, onRent, onNav }) {
  if (!product) return null;

  const handleAddToCart = () => {
    if (!user) {
      onNav("login");  // redirect to login
      return;
    }
    onAddToCart(product); // will save to cart
    onNav("cart");        // redirect to cart page instead of alert
  };

  const handleRentNow = () => {
    if (!user) {
      onNav("login");  // redirect to login
      return;
    }
    onRent(product);   // will trigger billing in App.js
    onNav("billing");  // redirect straight to billing page
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={onBack}>
        ← Back
      </button>
      <div className="card">
        <div className="row g-0">
          <div className="col-md-4 d-flex align-items-center">
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid rounded-start"
              style={{ maxHeight: "300px", objectFit: "contain" }}
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h3 className="card-title">{product.name}</h3>
              <p className="card-text">{product.description}</p>
              <p className="card-text fw-bold">₹{product.price}</p>
              <button className="btn btn-primary me-2" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="btn btn-success" onClick={handleRentNow}>
                Rent Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
