import React, { useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid"; // UUID for unique cart item IDs
import "./Categories.css";
import Footer from "./Footer";
import { fetchProducts, fetchCategories } from "./api";
import { PreferencesContext } from "./PreferencesContext";

function Categories({ selectedCategory, onBack, onAddToCart, onRent, user, onNav }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [quantities, setQuantities] = useState({}); // track product quantities

  const { preferences } = useContext(PreferencesContext);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data);
        const initialQuantities = {};
        data.forEach((p) => (initialQuantities[p._id] = 1));
        setQuantities(initialQuantities);
      })
      .catch((err) => console.error(err));

    fetchCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedCategory) setActiveCategory(selectedCategory);
    else setActiveCategory("All");
  }, [selectedCategory]);

  const allCategories = ["All", ...categories.map((c) => c.name)];

  const formatPrice = (price) => {
    switch (preferences.currency) {
      case "USD": return `$${price}`;
      case "EUR": return `€${price}`;
      default: return `₹${price}`;
    }
  };

  const handleQuantityChange = (id, change) => {
    setQuantities((prev) => {
      const newQty = Math.max(1, (prev[id] || 1) + change);
      return { ...prev, [id]: newQty };
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "All" || product.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="categories-container">
      <h2 className="categories-title">All Available Equipment</h2>

      {/* Search + Filter */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-2">
        <button className="btn btn-secondary" onClick={onBack}>← Back</button>

        <div className="d-flex flex-grow-1 align-items-center gap-2" style={{ maxWidth: "100%" }}>
          <input
            type="text"
            className="form-control flex-grow-1"
            placeholder="🔍 Search by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="dropdown">
            <button className="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
              {activeCategory}
            </button>
            <ul className="dropdown-menu dropdown-menu-end" style={{ minWidth: "180px", maxHeight: "200px", overflowY: "auto" }}>
              {allCategories.map((cat) => (
                <li key={cat}>
                  <button className={`dropdown-item ${activeCategory.toLowerCase() === cat.toLowerCase() ? "active" : ""}`}
                    onClick={() => setActiveCategory(cat)}>
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Products */}
      {filteredProducts.length === 0 ? <p>No products found.</p> :
        filteredProducts.map((product) => (
          <div className="product-row d-flex align-items-center mb-3 p-2 border rounded shadow-sm" key={product._id}>
            <img src={product.image} alt={product.name} className="product-image me-3 rounded"
              style={{ width: "100px", height: "100px", objectFit: "cover" }} />
            <div className="flex-grow-1">
              <h4 className="product-name mb-1 text-primary">{product.name}</h4>
              <p className="text-muted mb-0">{product.category}</p>
              <p className="text-muted mb-0">
                {formatPrice(product.price * (quantities[product._id] || 1))} | {product.location}
              </p>
            </div>

            {/* Quantity + Actions */}
            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-outline-secondary btn-sm" onClick={() => handleQuantityChange(product._id, -1)}>-</button>
              <span style={{ color: "black", minWidth: "20px", textAlign: "center" }}>{quantities[product._id] || 1}</span>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => handleQuantityChange(product._id, 1)}>+</button>

              <button className="btn btn-primary btn-sm"
                onClick={() => {
                  if (!user) { onNav("login"); return; }
                  onAddToCart({ ...product, quantity: quantities[product._id], cartItemId: uuidv4() });
                  onNav("cart");
                }}>Add to Cart</button>

              <button className="btn btn-success btn-sm"
  onClick={() => {
    if (!user) { onNav("login"); return; }
    onRent(product, quantities[product._id]); // ✅ pass qty as second argument
    onNav("billing");
  }}>Rent Now</button>
            </div>
          </div>
        ))
      }

      <Footer />
    </div>
  );
}

export default Categories;
