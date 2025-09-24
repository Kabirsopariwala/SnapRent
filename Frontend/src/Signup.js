import React, { useState } from "react";
import "./Auth.css";
import Footer from "./Footer";
import { signup } from "./api"; // ✅ import API
import { isValidEmail } from "./validateEmail";
import { isValidName } from "./validateName";

function Signup({ onSignupSuccess, onSwitch, onBack }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
  e.preventDefault();
  if (!name || !email || !pass || !confirmPass) {
    setError("All fields are required.");
    return;
  }
  if (!isValidName(name)) {
    setError("Name should only contain letters (Must be of 6-10 Characters)");
    return;
  }
  if (!isValidEmail(email)) {
    setError("Invalid email format.");
    return;
  }
  if (pass.length < 6) {
    setError("Password must be at least 6 characters.");
    return;
  }
  if (pass !== confirmPass) {
    setError("Passwords do not match.");
    return;
  }

  try {
    setLoading(true);
    setError("");

    // ✅ call API
    await signup(name, email, pass);

    // ✅ redirect to login instead of showing alert
    if (onSwitch) onSwitch();
  } catch (err) {
    console.error(err);
    setError(err.message || "Signup failed.");
  } finally {
    setLoading(false);
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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="form-control mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="form-control mb-3"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="form-control mb-3"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-danger w-100"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-3">
          Already have an account?{" "}
          <span onClick={onSwitch} style={{ color: "blue", cursor: "pointer" }}>
            Login here
          </span>
        </p>
        <button
          className="btn btn-outline-secondary mt-2 w-100"
          onClick={onBack}
        >
          ← Back to Home
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default Signup;
