// src/AddProduct.js
import React, { useState } from "react";
import "./AddProduct.css";

function AddProduct({ onSubmit, onBack }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const predefinedCategories = ["Photography", "Video", "Office", "Other"];

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalCategory = category === "Other" ? customCategory : category;

    if (!name || !finalCategory || !price || !location || !imageFile) {
      alert("Please fill out all fields.");
      return;
    }

    const newProduct = {
      id: Date.now(),
      name,
      category: finalCategory,
      price,
      location,
      image: URL.createObjectURL(imageFile),
    };

    onSubmit(newProduct);
  };

  return (
    <div className="add-product-container">
      <h2 className="mb-4">Add a Product for Rent</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name:</label>
          <input
            className="form-control"
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Category:</label>
          <select
            className="form-select"
            value={category}
            required
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {predefinedCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {category === "Other" && (
          <div className="mb-3">
            <label>Custom Category:</label>
            <input
              className="form-control"
              type="text"
              value={customCategory}
              required
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter your custom category"
            />
          </div>
        )}

        <div className="mb-3">
          <label>Price:</label>
          <input
            className="form-control"
            type="text"
            value={price}
            required
            onChange={(e) => setPrice(e.target.value)}
            placeholder="₹499/day"
          />
        </div>

        <div className="mb-3">
          <label>Location:</label>
          <input
            className="form-control"
            type="text"
            value={location}
            required
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Upload Image:</label>
          <input
            className="form-control"
            type="file"
            accept="image/*"
            required
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-success" type="submit">
            Submit
          </button>
          <button className="btn btn-secondary" type="button" onClick={onBack}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
