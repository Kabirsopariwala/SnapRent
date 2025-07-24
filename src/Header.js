import React from "react";
import './Header.css'
function Header()
{
    return(
        <nav className="navbar navbar-expand-sm">
            <a className="navbar-brand" id="brand" href="index.html">SnapRent</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#target">
                <span>Menu</span>
            </button>
            <div className="collapse navbar-collapse justify-content-center" id="target">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" href="index.html">Home</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Categories</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Header;