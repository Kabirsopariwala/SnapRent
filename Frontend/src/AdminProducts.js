import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDark.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    location: "",   // ✅ Added location field
  });

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/products", { withCredentials: true });
    setProducts(res.data.filter(p => !p.deleted));
  };

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/categories", { withCredentials: true });
    setCategories(res.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async () => {
    if (!form.name || !form.price || !form.category || !form.location) {
      return alert("All fields are required!");
    }
    await axios.post("http://localhost:5000/api/admin/products", form, { withCredentials: true });
    setForm({ name: "", price: "", image: "", category: "", location: "" });
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({ ...product });
  };

  const handleUpdate = async () => {
    if (!form.name || !form.price || !form.category || !form.location) {
      return alert("All fields are required!");
    }
    await axios.put(`http://localhost:5000/api/admin/products/${editingProduct._id}`, form, { withCredentials: true });
    setEditingProduct(null);
    setForm({ name: "", price: "", image: "", category: "", location: "" });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    await axios.delete(`http://localhost:5000/api/admin/products/${id}`, { withCredentials: true });
    setProducts(products.filter(p => p._id !== id));
  };

  return (
    <div className="admin-container">
      <h2>Manage Products</h2>

      <div className="form-group">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">Select Category</option>
          {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
        </select>
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} /> {/* ✅ Location input */}

        {editingProduct ? (
          <>
            <button className="update-btn" onClick={handleUpdate}>Update</button>
            <button className="delete-btn" onClick={() => { 
              setEditingProduct(null); 
              setForm({ name: "", price: "", image: "", category: "", location: "" }); 
            }}>Cancel</button>
          </>
        ) : (
          <button className="add-btn" onClick={handleAdd}>Add Product</button>
        )}
      </div>

      <div className="card-grid">
        {products.map(p => (
          <div className="card" key={p._id}>
            {p.image && <img src={p.image} alt={p.name} className="card-img" />}
            <h3>{p.name}</h3>
            <p>Price: ₹{p.price}</p>
            <p>Category: {p.category}</p>
            <p>📍 Location: {p.location}</p> {/* ✅ Show location */}
            <div className="card-actions">
              <button className="edit-btn" onClick={() => handleEdit(p)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(p._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
