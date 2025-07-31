// src/ProductDetails.js
import React from "react";
import "./ProductDetails.css";
import Footer from "./Footer";

function ProductDetails({ product, onBack }) {
  if (!product) return null;

  return (
    <div>
    <div className="details-container d-flex justify-content-center align-items-center">
      <div className="product-card p-4 rounded shadow-lg">
        <img
          src={product.image}
          alt={product.name}
          className="product-image mb-3"
        />

        <h2 className="mb-2 text-center">{product.name}</h2>
        <p className="text-muted text-center mb-1">{product.category}</p>
        <p className="mb-1"><strong>Price:</strong> {product.price}</p>
        <p className="mb-4"><strong>Location:</strong> {product.location}</p>

        <div className="d-flex justify-content-between">
          <button className="btn btn-outline-secondary" onClick={onBack}>← Back</button>
          <button className="btn btn-success">Rent Now</button>
        </div>
      </div>
      </div>
      <Footer/>
    </div>
  );
}

export default ProductDetails;
