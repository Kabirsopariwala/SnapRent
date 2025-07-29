import React, { useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import "./Header.css";

function Header({ onLogin, onSignup, isLoggedIn, onLogout, onNav }) {
  const collapseRef = useRef(null);

  const closeNavbar = () => {
    if (collapseRef.current?.classList.contains("show")) {
      const bsCollapse = window.bootstrap.Collapse.getInstance(collapseRef.current);
      if (bsCollapse) bsCollapse.hide();
    }
  };

  const handleNavClick = (page) => {
    onNav(page);
    closeNavbar();
  };

  const handleLogin = () => {
    onLogin();
    closeNavbar();
  };

  const handleSignup = () => {
    onSignup();
    closeNavbar();
  };

  return (
    <nav className="navbar navbar-expand-sm px-3">
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

      <div
        className="collapse navbar-collapse justify-content-between"
        id="navbarContent"
        ref={collapseRef}
      >
        <ul className="navbar-nav d-flex align-items-center">
          <li className="nav-item me-3">
            <a className="nav-link" href="#" onClick={() => handleNavClick("home")}>
              Home
            </a>
          </li>
          <li className="nav-item me-3">
            <a className="nav-link" href="#" onClick={() => handleNavClick("categories")}>
              Categories
            </a>
          </li>
          <li className="nav-item me-3">
            <button
              className="btn btn-outline-light"
              id="list"
              onClick={() => handleNavClick("addProduct")}
            >
              List Your Product
            </button>
          </li>
        </ul>

        <div className="d-flex align-items-center ms-auto user-controls">
          {isLoggedIn ? (
            <div className="dropdown user-dropdown">
              <button
                type="button"
                className="btn dropdown-toggle d-flex align-items-center"
                id="dropdownUser"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ background: "none", border: "none", color: "white" }}
              >
                <FaUserCircle size={28} />
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownUser">
                <li><a className="dropdown-item" href="#">My Rentals</a></li>
                <li><a className="dropdown-item" href="#">Settings</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item text-danger" onClick={onLogout}>Logout</button></li>
              </ul>
            </div>
          ) : (
            <>
              <button className="btn btn-success me-2" id="login" onClick={handleLogin}>
                Login
              </button>
              <button className="btn btn-danger" id="signup" onClick={handleSignup}>
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
