// Header.js
import React from "react";
import { FaUserCircle } from "react-icons/fa";
import './Header.css';

function Header({ onLogin, onSignup, isLoggedIn, onLogout }) {
  return (
    <nav className="navbar navbar-expand-sm">
      <a className="navbar-brand" id="brand" href="#">SnapRent</a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#target">
        <span><i className='bx bx-menu'></i></span>
      </button>
      <div className="collapse navbar-collapse justify-content-center" id="target">
        <ul className="navbar-nav">
          <li className="nav-item"><a className="nav-link" href="index.html">Home</a></li>
          <li className="nav-item"><a className="nav-link" href="#">Categories</a></li>
        </ul>

        <div className="user-controls d-flex align-items-center justify-content-end justify-content-center-sm w-100 w-lg-auto">
  {isLoggedIn ? (
    <div className="dropdown">
      <button
        className="btn dropdown-toggle d-flex align-items-center"
        data-bs-toggle="dropdown"
        style={{ background: "none", border: "none" }}
      >
        <FaUserCircle size={28} />
      </button>
      <ul className="dropdown-menu dropdown-menu-end">
        <li><a className="dropdown-item" href="#">My Rentals</a></li>
        <li><a className="dropdown-item" href="#">Settings</a></li>
        <li><hr className="dropdown-divider" /></li>
        <li><button className="dropdown-item text-danger" onClick={onLogout}>Logout</button></li>
      </ul>
    </div>
  ) : (
    <>
      <button className="btn btn-success me-2" id="login" onClick={onLogin}>Login</button>
      <button className="btn btn-danger" id="signup" onClick={onSignup}>Sign Up</button>
    </>
  )}


        </div>
      </div>
    </nav>
  );
}

export default Header;
