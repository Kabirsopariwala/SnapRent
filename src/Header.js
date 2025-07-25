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
            <div className="collapse navbar-collapse justify-content-center"  id="target">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" href="index.html">Home</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Categories</a>
                    </li>
                </ul>
                <input type="text" id="search" placeholder="Search"></input>
                <button type="button" id="srchbtn"><i class='bx  bx-search'  ></i> </button>
               <div className="ms-auto">
                <a href="login.html" className="btn btn-success me-2" id="login">Login</a>
                <a href="signup.html" className="btn btn-danger" id="signup">Sign Up</a>
               </div>
            </div>
        </nav>
    );
}

export default Header;
