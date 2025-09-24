import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDark.css";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState(""); // for adding new category
  const [editId, setEditId] = useState(null); // track which category is being edited
  const [editName, setEditName] = useState(""); // store updated name

  // fetch all categories
  async function fetchCategories() {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/categories", { withCredentials: true });
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  }

  useEffect(() => { fetchCategories(); }, []);

  // add new category
  const addCategory = async () => {
    if (!newName.trim()) return;
    try {
      await axios.post("http://localhost:5000/api/admin/categories", { name: newName }, { withCredentials: true });
      setNewName("");
      fetchCategories();
    } catch (err) {
      console.error("Failed to add category", err);
    }
  };

  // enable edit mode
  const startEdit = (id, name) => {
    setEditId(id);
    setEditName(name);
  };

  // update category
  const updateCategory = async (id) => {
    if (!editName.trim()) return;
    try {
      await axios.put(`http://localhost:5000/api/admin/categories/${id}`, { name: editName }, { withCredentials: true });
      setEditId(null);
      setEditName("");
      fetchCategories();
    } catch (err) {
      console.error("Failed to update category", err);
    }
  };

  // delete category
  const deleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/categories/${id}`, { withCredentials: true });
      fetchCategories();
    } catch (err) {
      console.error("Failed to delete category", err);
    }
  };

  return (
    <div className="admin-container">
      <h2>Categories</h2>

      {/* Add Form */}
      <div className="form-group">
        <input
          type="text"
          placeholder="Category Name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <button className="add-btn" onClick={addCategory}>Add</button>
      </div>

      {/* Categories List */}
      <div className="card-grid">
        {categories.map(c => (
          <div className="card" key={c._id}>
            {editId === c._id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                />
                <div className="card-actions">
                  <button className="update-btn" onClick={() => updateCategory(c._id)}>Save</button>
                  <button className="cancel-btn" onClick={() => { setEditId(null); setEditName(""); }}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h3>{c.name}</h3>
                <div className="card-actions">
                  <button className="edit-btn" onClick={() => startEdit(c._id, c.name)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteCategory(c._id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
