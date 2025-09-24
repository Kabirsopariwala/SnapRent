import React, { useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import Header from "./Header";
import Body from "./Body";
import Login from "./Login";
import Signup from "./Signup";
import Categories from "./Categories";
import ProductDetails from "./ProductDetails";
import Cart from "./Cart";
import Billing from "./Billing";
import Orders from "./Orders";
import UserSettings from "./UserSettings";
import { fetchCart, saveCart, fetchOrders } from "./api";
import { PreferencesContext } from "./PreferencesContext";
import "./App.css";

function App() {
  const { preferences, setPreferences } = useContext(PreferencesContext);

  const [page, setPage] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userProducts, setUserProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [billingData, setBillingData] = useState(null);
  const [orders, setOrders] = useState([]);

  // Load user + data on mount
  useEffect(() => {
    const storedUserRaw = localStorage.getItem("user");
    if (storedUserRaw) {
      try {
        const storedUser = JSON.parse(storedUserRaw);
        setUser(storedUser);
        loadUserData();
        if (storedUser.preferences) setPreferences(storedUser.preferences);
      } catch (err) {
        console.error("Failed to parse stored user:", err);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const loadUserData = async () => {
    try {
      const userCart = await fetchCart();
      const userOrders = await fetchOrders();
      setCart(userCart);
      setOrders(userOrders);
    } catch (err) {
      console.error("Failed to load user data:", err);
    }
  };

  // Login / Logout
  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser));

    if (loggedInUser.preferences) setPreferences(loggedInUser.preferences);

    loadUserData();
    setPage("home");
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setOrders([]);
    localStorage.removeItem("user");
    setPreferences({ theme: "Light", currency: "INR" });
    setPage("home");
  };

  // Cart Handlers
  const handleAddToCart = async (product) => {
    if (!user) {
      setPage("login");
      return;
    }

    const cartProduct = { ...product, cartItemId: uuidv4(), quantity: product.quantity || 1 };
    const newCart = [...cart, cartProduct];
    setCart(newCart);

    try {
      await saveCart(newCart);
      alert("✅ Product added to cart");
    } catch (err) {
      console.error("Failed to save cart:", err);
      alert("Failed to save cart. Try again.");
    }
  };

  const handleRemoveFromCart = async (cartItemId) => {
    const newCart = cart.filter((item) => item.cartItemId !== cartItemId);
    setCart(newCart);

    try {
      await saveCart(newCart);
    } catch (err) {
      console.error("Failed to update cart:", err);
      alert("Failed to update cart. Try again.");
    }
  };

  const handleRentNow = async (product, qty) => {
    if (!user) {
      setPage("login");
      return;
    }

    if (product.cartItemId) {
      const newCart = cart.filter((item) => item.cartItemId !== product.cartItemId);
      setCart(newCart);
      try {
        await saveCart(newCart);
      } catch (err) {
        console.error("Failed to update cart before renting:", err);
      }
    }

    setBillingData({ product, qty });
    setPage("billing");
  };

  return (
    <div>
      <h1 id="title">Welcome to SnapRent</h1>
      <Header
        onLogin={() => setPage("login")}
        onSignup={() => setPage("signup")}
        isLoggedIn={!!user}
        onLogout={handleLogout}
        onNav={(target) => {
          if (target === "settings") setPage("user-settings");
          else setPage(target);
        }}
        cartCount={cart.length}
        user={user}
      />

      {/* Pages */}
      {page === "home" && (
        <>
          <p id="tagline">Rent gear and gadgets anytime!</p>
          <Body onCategoryClick={(category) => { setSelectedCategory(category); setPage("categories"); }} />
        </>
      )}

      {page === "login" && <Login onLoginSuccess={handleLoginSuccess} onSwitch={() => setPage("signup")} onBack={() => setPage("home")} />}
      {page === "signup" && <Signup onSignupSuccess={handleLoginSuccess} onSwitch={() => setPage("login")} onBack={() => setPage("home")} />}
      {page === "categories" && (
        <Categories
          selectedCategory={selectedCategory}
          userProducts={userProducts}
          onBack={() => setPage("home")}
          onAddToCart={handleAddToCart}
          onRent={handleRentNow}
          user={user}
          onNav={setPage}
        />
      )}

      {page === "productDetails" && (
        <ProductDetails
          product={selectedProduct}
          user={user}
          onBack={() => setPage("categories")}
          onAddToCart={handleAddToCart}
          onRent={handleRentNow}
          onNav={setPage}
        />
      )}

      {page === "cart" && (
        <Cart
          cartItems={cart}
          user={user}
          onBack={() => setPage("home")}
          onRemoveFromCart={handleRemoveFromCart}
          onRentNow={handleRentNow}
        />
      )}

      {page === "user-settings" && <UserSettings user={user} onUpdateUser={setUser} />}

      {page === "billing" && billingData && (
        <Billing
          product={billingData.product}
          qty={billingData.qty}
          onBack={() => setPage("cart")}
          onOrderPlaced={(order) => { setOrders([...orders, order]); setBillingData(null); setPage("orders"); }}
        />
      )}

      {page === "orders" && <Orders user={user} onBack={() => setPage("home")} />}
    </div>
  );
}

export default App;
