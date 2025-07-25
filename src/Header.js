import React from "react";
import './Header.css'
function Header()
{
    return(
        <div>
        <nav className="navbar navbar-expand-sm">
            <a className="navbar-brand" id="brand" href="index.html">SnapRent</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#target">
                <span><i class='bx  bx-menu'  ></i> </span>
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
               <div className="ms-auto d-flex flex-wrap auth-buttons">
  <a href="login.html" className="btn btn-success" id="login">Login</a>
  <a href="signup.html" className="btn btn-danger" id="signup">Sign Up</a>
</div>
            </div>
        </nav>
                
                
                
                
                
                
                
                </div>
    );
}

export default Header;
