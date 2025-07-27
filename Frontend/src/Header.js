import React from "react";
import { FaUserCircle } from "react-icons/fa";
import "./Header.css";

function Header({ onLogin, onSignup, isLoggedIn, onLogout, onNav }) {
  return (
    <nav className="navbar navbar-expand-sm  px-3">
      <a className="navbar-brand" id="brand" href="#">
        SnapRent
      </a>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse justify-content-between" id="navbarContent">
        {/* Left side: nav links */}
        <ul className="navbar-nav d-flex align-items-center">
          <li className="nav-item me-3">
            <a className="nav-link" href="#" onClick={() => onNav("home")}>
              Home
            </a>
          </li>
          <li className="nav-item me-3">
            <a className="nav-link" href="#" onClick={() => onNav("categories")}>
              Categories
            </a>
          </li>
          <li className="nav-item me-3">
            <button
              className="btn btn-outline-light"
              id="list"
              onClick={() => onNav("addProduct")}
            >
              List Your Product
            </button>
          </li>
        </ul>

        {/* Right side: user controls */}
        <div className="d-flex align-items-center">
          {isLoggedIn ? (
            <div className="dropdown">
              <button
                className="btn dropdown-toggle d-flex align-items-center"
                data-bs-toggle="dropdown"
                style={{ background: "none", border: "none", color: "white" }}
              >
                <FaUserCircle size={28} />
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a className="dropdown-item" href="#">
                    My Rentals
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Settings
                  </a>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={onLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <button className="btn btn-success me-2"id="login" onClick={onLogin}>
                Login
              </button>
              <button className="btn btn-danger" id="signup" onClick={onSignup}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
