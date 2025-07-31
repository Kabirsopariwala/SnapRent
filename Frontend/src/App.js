import React, { useState } from "react";
import Header from "./Header";
import Body from "./Body";
import Login from "./Login";
import Signup from "./Signup";
import Categories from "./Categories";
import "./App.css";
import ProductDetails from './ProductDetails';
import AddProduct from "./AddProduct";


function App() {
  const [page, setPage] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userProducts, setUserProducts] = useState([]);




  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setPage("home");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPage("home");
  };

  return (
    <div>
      <h1 id="title">Welcome to SnapRent</h1>
      <Header
        onLogin={() => setPage("login")}
        onSignup={() => setPage("signup")}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onNav={(target) => setPage(target)}
      />

      {page === "home" && (
        <>
          <p id="tagline">Rent gear and gadgets anytime!</p>
          <Body
            onCategoryClick={(category) => {
              setSelectedCategory(category);     // ✅ set category
              setPage("categories");             // ✅ go to categories page
            }}
          />
        </>
      )}

      {page === "login" && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onSwitch={() => setPage("signup")}
          onBack={() => setPage("home")}
        />
      )}

      {page === "signup" && (
        <Signup
          onSignupSuccess={handleLoginSuccess}
          onSwitch={() => setPage("login")}
          onBack={() => setPage("home")}
        />
      )}

   

  {page === "categories" && (
  <Categories
    selectedCategory={selectedCategory}
    onProductClick={(product) => {
      setSelectedProduct(product);
      setPage("productDetails");
    }}
    userProducts={userProducts}
    onBack={() => setPage("home")}
  />
)}





      {page === "productDetails" && (
  <ProductDetails
    product={selectedProduct}
    onBack={() => setPage("categories")}
  />
)}

{page === "addProduct" && (
  <AddProduct
    onSubmit={(newProduct) => {
      setUserProducts([...userProducts, { ...newProduct, id: Date.now() }]);
      setPage("categories"); // go back to categories
    }}
    onBack={() => setPage("home")}
  />
)}


    </div>
  );
}

export default App;
