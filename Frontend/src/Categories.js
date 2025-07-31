// src/Categories.js
import React, { useState, useEffect } from "react";
import "./Categories.css";
import Footer from "./Footer";

// Default sample products
const dummyProducts = [
  {
    id: 1,
    name: "Canon DSLR Camera",
    image: "videoeqp.jpeg",
    category: "Photography",
    price: "₹499/day",
    location: "Mumbai",
  },
  {
    id: 2,
    name: "GoPro Hero 11",
    image: "audioeqp.jpeg",
    category: "Video",
    price: "₹699/day",
    location: "Delhi",
  },
  {
    id: 3,
    name: "DJI Drone Mini 4",
    image: "videoeqp.jpeg",
    category: "Video",
    price: "₹899/day",
    location: "Bangalore",
  },
  {
    id: 4,
    name: "Tripod Stand",
    image: "officeeqp.jpeg",
    category: "Office",
    price: "₹199/day",
    location: "Pune",
  },
  {
    id: 5,
    name: "Boom Mic Stand",
    image: "audioeqp.jpeg",
    category: "Audio",
    price: "₹149/day",
    location: "Hyderabad",
  },
];

function Categories({ selectedCategory, onProductClick, userProducts = [] }) {
  const [activeCategory, setActiveCategory] = useState(null);

  const allProducts = [...dummyProducts, ...userProducts];

  // Extract unique categories
  const predefined = ["Photography", "Video", "Office"];
  const allCategorySet = new Set(["All", ...predefined]);

  allProducts.forEach((product) => {
    if (!predefined.includes(product.category)) {
      allCategorySet.add(product.category);
    }
  });

  const allCategories = Array.from(allCategorySet);

  // Update selected category
  useEffect(() => {
    if (selectedCategory) {
      setActiveCategory(selectedCategory);
    } else {
      setActiveCategory("All");
    }
  }, [selectedCategory]);

  if (activeCategory === null) return null;

  // Filter
  const filteredProducts =
    activeCategory === "All"
      ? allProducts
      : allProducts.filter((product) => product.category === activeCategory);

  return (
    <div className="categories-container">
      <h2 className="categories-title">All Available Equipment</h2>

      {/* Category filter buttons */}
      <div className="category-filters mb-4">
        {allCategories.map((cat) => (
          <button
            key={cat}
            className={`btn m-1 ${
              activeCategory === cat ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product list */}
      {filteredProducts.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        filteredProducts.map((product) => (
          <div
            className="product-row d-flex align-items-center mb-3"
            key={product.id}
          >
            <img
              src={product.image}
              alt={product.name}
              className="product-image me-3"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
            <div className="product-info">
              <h4
                className="product-name mb-1 text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => onProductClick(product)}
              >
                {product.name}
              </h4>
              <p className="text-muted mb-0">{product.category}</p>
              <p className="text-muted mb-0">
                {product.price} | {product.location}
              </p>
            </div>
          </div>
        ))
      )}
      
    </div>
  );
}

export default Categories;
