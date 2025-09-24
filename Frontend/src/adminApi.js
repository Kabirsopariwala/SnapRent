const BASE_URL = "http://localhost:5000/api";

// Safe fetch function
async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });

  let data = null;
  try { data = await res.json(); } catch(e) { /* ignore */ }

  if (!res.ok) {
    throw new Error(data?.error || data?.message || `Unknown error (status ${res.status})`);
  }
  return data;
}

// ---------------- Users ----------------
export const getUsers = () => fetchJSON(`${BASE_URL}/admin/users`);
export const updateUserStatus = (id, active) =>
  fetchJSON(`${BASE_URL}/admin/users/${id}`, { method: "PATCH", body: JSON.stringify({ active }) });

// ---------------- Products ----------------
export const getProducts = () => fetchJSON(`${BASE_URL}/products`);
export const addProduct = (product) =>
  fetchJSON(`${BASE_URL}/admin/products`, { method: "POST", body: JSON.stringify(product) });
export const updateProduct = (id, product) =>
  fetchJSON(`${BASE_URL}/admin/products/${id}`, { method: "PUT", body: JSON.stringify(product) });
export const deleteProduct = (id) =>
  fetchJSON(`${BASE_URL}/admin/products/${id}`, { method: "DELETE" });

// ---------------- Categories ----------------
export const getCategories = () => fetchJSON(`${BASE_URL}/categories`);
export const addCategory = (category) =>
  fetchJSON(`${BASE_URL}/admin/categories`, { method: "POST", body: JSON.stringify(category) });
export const updateCategory = (id, category) =>
  fetchJSON(`${BASE_URL}/admin/categories/${id}`, { method: "PUT", body: JSON.stringify(category) });
export const deleteCategory = (id) =>
  fetchJSON(`${BASE_URL}/admin/categories/${id}`, { method: "DELETE" });

// ---------------- Orders ----------------
export const getOrders = () => fetchJSON(`${BASE_URL}/admin/orders`);
export const updateOrderStatus = (id, status) =>
  fetchJSON(`${BASE_URL}/admin/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });

// ---------------- Admin ----------------
export const addAdmin = (admin) =>
  fetchJSON(`${BASE_URL}/admins`, { method: "POST", body: JSON.stringify({ ...admin, role: "admin" }) });

export const updateAdminProfile = (data) =>
  fetchJSON(`${BASE_URL}/admins/profile`, { method: "PUT", body: JSON.stringify(data) });

export const updateAdminPassword = (data) =>
  fetchJSON(`${BASE_URL}/admins/password`, { method: "PUT", body: JSON.stringify(data) });
