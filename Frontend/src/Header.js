import React, { useRef } from "react";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import "./Header.css";

function Header({ onLogin, onSignup, isLoggedIn, onLogout, onNav, cartCount, user }) {
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

  return (
    <nav className="navbar navbar-expand-sm px-3">
      <a className="navbar-brand" id="brand" href="#">SnapRent</a>

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

          {/* Cart */}
          <li className="nav-item me-3">
            <a className="nav-link position-relative" href="#" onClick={() => handleNavClick("cart")}>
              <FaShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                  {cartCount}
                </span>
              )}
            </a>
          </li>

          {/* Orders */}
          <li className="nav-item me-3">
            <button className="nav-link" onClick={() => handleNavClick("orders")}>
              Orders
            </button>
          </li>
        </ul>

        {/* Right side user controls */}
        <div className="d-flex align-items-center ms-auto user-controls">
          {isLoggedIn ? (
            <div className="dropdown user-dropdown d-flex align-items-center">
              <button
                type="button"
                className="btn dropdown-toggle d-flex align-items-center"
                id="dropdownUser"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ background: "none", border: "none", color: "white" }}
              >
                <FaUserCircle size={28} />
                <span className="ms-2">{user?.name}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownUser">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleNavClick("user-settings")}
                  >
                    Settings
                  </button>
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
              <button className="btn btn-success me-2" id="login" onClick={onLogin}>
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
