import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Form, Modal } from "react-bootstrap";

function Products() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", price: "", image: "" });
  const [editId, setEditId] = useState(null);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/products", { withCredentials: true });
    setProducts(res.data);
  };

  const saveProduct = async () => {
    if (editId) {
      await axios.put(`http://localhost:5000/api/admin/products/${editId}`, formData, { withCredentials: true });
    } else {
      await axios.post("http://localhost:5000/api/admin/products", formData, { withCredentials: true });
    }
    setShowModal(false);
    setFormData({ name: "", price: "", image: "" });
    setEditId(null);
    fetchProducts();
  };

  const editProduct = (p) => {
    setFormData({ name: p.name, price: p.price, image: p.image });
    setEditId(p._id);
    setShowModal(true);
  };

  const deleteProduct = async (id) => {
    await axios.delete(`http://localhost:5000/api/admin/products/${id}`, { withCredentials: true });
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h3>Products</h3>
      <Button onClick={() => setShowModal(true)} className="mb-3">Add Product</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.image}</td>
              <td>
                <Button variant="primary" onClick={() => editProduct(p)}>Edit</Button>{" "}
                <Button variant="danger" onClick={() => deleteProduct(p._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Edit Product" : "Add Product"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Image URL</Form.Label>
              <Form.Control value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="success" onClick={saveProduct}>{editId ? "Update" : "Add"}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Products;
