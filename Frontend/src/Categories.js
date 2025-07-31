import React, { useState, useEffect } from "react";
import "./Categories.css";
import Footer from "./Footer";

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

function Categories({ selectedCategory, onProductClick, userProducts = [], onBack }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const allProducts = [...dummyProducts, ...userProducts];

  const predefined = ["Photography", "Video", "Office", "Audio", "Medical"];
  const categorySet = new Set(["All", ...predefined]);
  allProducts.forEach((product) => categorySet.add(product.category));
  const allCategories = Array.from(categorySet);

  useEffect(() => {
    if (selectedCategory) {
      setActiveCategory(selectedCategory);
    } else {
      setActiveCategory("All");
    }
  }, [selectedCategory]);

  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="categories-container">
      <h2 className="categories-title">All Available Equipment</h2>

      {/* Search + Filter */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-2">
  {/* Back button */}
  <button className="btn btn-secondary" onClick={onBack}>
    ← Back
  </button>

  {/* Search and Filter */}
  <div className="d-flex flex-grow-1 align-items-center gap-2" style={{ maxWidth: "100%" }}>
    <input
      type="text"
      className="form-control flex-grow-1"
      placeholder="Search by name or category"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />

    <div className="dropdown">
      <button
        className="btn btn-outline-primary dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Filter
      </button>
      <ul
        className="dropdown-menu dropdown-menu-end"
        aria-labelledby="dropdownMenuButton"
        style={{ minWidth: "180px", maxHeight: "200px", overflowY: "auto" }}
      >
        {allCategories.map((cat) => (
          <li key={cat}>
            <button
              className={`dropdown-item ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>



      {/* Products */}
      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        filteredProducts.map((product) => (
          <div className="product-row d-flex align-items-center mb-3" key={product.id}>
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

      <Footer />
    </div>
  );
}

export default Categories;
