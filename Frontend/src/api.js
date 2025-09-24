const BASE_URL = "http://localhost:5000/api";

// -------------------
// Helper for fetch with consistent JSON handling
// -------------------
async function fetchJSON(url, options = {}) {
  try {
    const res = await fetch(url, {
      ...options,
      credentials: "include", // send cookies
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    });

    // Try parsing JSON
    let data;
    try {
      data = await res.json();
    } catch {
      data = { error: "Invalid JSON response from server" };
    }

    if (!res.ok) {
      const msg = data?.error || data?.message || "Unknown error";
      throw new Error(msg);
    }

    return data;
  } catch (err) {
    // Network errors or JSON parse errors
    throw new Error(err.message || "Network error");
  }
}

// -------------------
// Auth
// -------------------
export async function signup(name, email, password) {
  return fetchJSON(`${BASE_URL}/signup`, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function login(email, password) {
  return fetchJSON(`${BASE_URL}/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function forgotPassword(email, newPassword, confirmPassword) {
  return fetchJSON(`${BASE_URL}/forgot-password`, {
    method: "POST",
    body: JSON.stringify({ email, newPassword, confirmPassword }),
  });
}

export async function logout() {
  return fetchJSON(`${BASE_URL}/logout`, { method: "POST" });
}

// -------------------
// Products & Cart
// -------------------
export async function fetchProducts() {
  return fetchJSON(`${BASE_URL}/products`);
}

export async function fetchCart() {
  return fetchJSON(`${BASE_URL}/cart`);
}

export async function saveCart(cart) {
  return fetchJSON(`${BASE_URL}/cart`, {
    method: "POST",
    body: JSON.stringify({ cart }),
  });
}

// -------------------
// Orders
// -------------------
export async function fetchOrders() {
  return fetchJSON(`${BASE_URL}/orders`);
}

export async function placeOrder({ productId, qty, total }) {
  return fetchJSON(`${BASE_URL}/orders`, {
    method: "POST",
    body: JSON.stringify({ productId, qty, total }),
  });
}

// -------------------
// Categories
// -------------------
export async function fetchCategories() {
  return fetchJSON(`${BASE_URL}/categories`);
}

// -------------------
// User Settings
// -------------------
export async function updateProfile(name, email) {
  return fetchJSON(`${BASE_URL}/users/profile`, {
    method: "PUT",
    body: JSON.stringify({ name, email }),
  });
}

export async function updatePassword(oldPassword, newPassword) {
  return fetchJSON(`${BASE_URL}/users/password`, {
    method: "PUT",
    body: JSON.stringify({ oldPassword, newPassword }),
  });
}

export async function updateNotifications(emailNotifications, smsNotifications) {
  return fetchJSON(`${BASE_URL}/users/notifications`, {
    method: "PUT",
    body: JSON.stringify({ emailNotifications, smsNotifications }),
  });
}

export async function updatePreferences(preferences) {
  // preferences is an object: { theme, showTips, enableSounds, compactView, emailNotifications, smsNotifications }
  return fetchJSON(`${BASE_URL}/users/preferences`, {
    method: "PUT",
    body: JSON.stringify(preferences),
  });
}


export async function deleteAccount() {
  return fetchJSON(`${BASE_URL}/users/delete`, { method: "DELETE" });
}
