import React, { useState } from "react";
import Header from "./Header";
import Body from "./Body";
import Login from "./Login";
import Signup from "./Signup";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);     // ✅ update header
    setPage("home");         // ✅ go back to homepage
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
      />
      {page === "home" && (
        <>
          
          <p id="tagline">Rent gear and gadgets anytime!</p>
          <Body />
        </>
      )}
      {page === "login" && (
  <Login
    onLoginSuccess={handleLoginSuccess}
    onSwitch={() => setPage("signup")}
    onBack={() => setPage("home")}     // 👈 Pass this
  />
)}
{page === "signup" && (
  <Signup
    onSignupSuccess={handleLoginSuccess}
    onSwitch={() => setPage("login")}
    onBack={() => setPage("home")}     // 👈 Pass this
  />
)}    </div>
  );
}

export default App;
