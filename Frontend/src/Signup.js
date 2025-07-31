import React, { useState } from "react";
import "./Auth.css";
import Footer from "./Footer";

function Signup({ onSignupSuccess, onSwitch, onBack}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();

    if (!name || !email || !pass || !confirmPass) {
      setError("All fields are required.");
    } else if (!email.includes("@")) {
      setError("Invalid email format.");
    } else if (pass.length < 6) {
      setError("Password must be at least 6 characters.");
    } else if (pass !== confirmPass) {
      setError("Passwords do not match.");
    } else {
      // ✅ Signup success
      // You can add logic to save the user to DB or localStorage here
      onSignupSuccess();  // Redirects to homepage
    }
  };

  return (
    <div>
    <div className="auth-container">
      <h2 className="auth-title">Create your SnapRent account</h2>
      {error && <p className="text-danger">{error}</p>}
      <form className="auth-form" onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Full Name"
          className="form-control mb-3"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="form-control mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="form-control mb-3"
          onChange={(e) => setPass(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="form-control mb-3"
          onChange={(e) => setConfirmPass(e.target.value)}
        />
        <button type="submit" className="btn btn-danger w-100">Sign Up</button>
      </form>
      <p className="mt-3">
        Already have an account?{" "}
        <span onClick={onSwitch} style={{ color: "blue", cursor: "pointer" }}>
          Login here
        </span>
      </p>
      <button className="btn btn-outline-secondary mt-2 w-100" onClick={onBack}>← Back to Home</button>
    </div>
    <Footer/>
    </div>
  );
}

export default Signup;
