import React, { useState } from "react";
import "./Auth.css";

function Login({ onSwitch, onLoginSuccess, onBack }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !pass) {
      setError("All fields are required.");
    } else if (!email.includes("@")) {
      setError("Invalid email format.");
    } else {
      setError('');
      onLoginSuccess(); // ✅ Navigate to homepage
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login to SnapRent</h2>
      {error && <p className="text-danger">{error}</p>}
      <form className="auth-form" onSubmit={handleLogin}>
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
        <button type="submit" className="btn btn-success w-100">Login</button>
      </form>
      <p className="mt-2 text-center">
        Don't have an account?{" "}
        <span className="link-primary" style={{ cursor: "pointer" }} onClick={onSwitch}>
          Create One
        </span>
      </p>
      <button className="btn btn-outline-secondary mt-2 w-100" onClick={onBack}>← Back to Home</button>
    </div>
    
  );
}

export default Login;
