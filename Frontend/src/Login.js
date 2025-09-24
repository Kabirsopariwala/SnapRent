import React, { useState } from "react";
import "./Auth.css";
import Footer from "./Footer";
import { login, forgotPassword } from "./api";
import { isValidEmail } from "./validateEmail";


function Login({ onSwitch, onLoginSuccess, onBack }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [forgotMode, setForgotMode] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // -------- Login Function ----------
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !pass) {
      setError("All fields are required.");
      return;
    }
if (!isValidEmail(email)) {
  setError("Invalid email format.");
  return;
}


    try {
      setLoading(true);
      setError("");
      const data = await login(email, pass);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (onLoginSuccess) onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  // -------- Forgot Password Function ----------
  const handleForgot = async (e) => {
    e.preventDefault();
    if (!email || !newPass || !confirmPass) {
      setError("All fields are required.");
      return;
    }
    if (newPass !== confirmPass) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await forgotPassword(email, newPass, confirmPass);
      alert(data.message);
      setForgotMode(false);
      setEmail(""); setNewPass(""); setConfirmPass("");
    } catch (err) {
      setError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="auth-container">
        <h2 className="auth-title">
          {forgotMode ? "Reset Password" : "Login to SnapRent"}
        </h2>
        {error && <p className="text-danger">{error}</p>}

        {forgotMode ? (
          <form className="auth-form" onSubmit={handleForgot}>
            <input
              type="email"
              placeholder="Email"
              className="form-control mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              className="form-control mb-3"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="form-control mb-3"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
            <button type="submit" className="btn btn-success w-100" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
            <p className="mt-2 text-center">
              <span
                className="link-primary"
                style={{ cursor: "pointer" }}
                onClick={() => setForgotMode(false)}
              >
                ← Back to Login
              </span>
            </p>
          </form>
        ) : (
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
            <button type="submit" className="btn btn-success w-100" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="mt-2 text-center">
              <span
                className="link-primary"
                style={{ cursor: "pointer" }}
                onClick={() => setForgotMode(true)}
              >
                Forgot Password?
              </span>
            </p>
          </form>
        )}

        {!forgotMode && (
          <>
            <p className="mt-2 text-center">
              Don't have an account?{" "}
              <span
                className="link-primary"
                style={{ cursor: "pointer" }}
                onClick={onSwitch}
              >
                Create One
              </span>
            </p>
            <button className="btn btn-outline-secondary mt-2 w-100" onClick={onBack}>
              ← Back to Home
            </button>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Login;
