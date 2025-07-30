import React, { useState } from "react";
import "./Footer.css";

function Footer() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="footer">
      <div className="top-banner">
        Get the best deals on your rentals with SnapRent. Happy Renting!
      </div>

      <div className="footer-main">
        <div className="brand-section">
          <h4 className="brand">SNAP<span>RENT</span>.COM</h4>
          <p>SnapRent Pvt. Ltd.,<br />
            51/2, Main Road, Your City<br />
            CIN: U93000XX2025PTC123456<br />
            Email: support@snaprent.com
          </p>
        </div>

        {/* Collapsible Sections */}
        <div className="collapsible-section">
          <div className="section-header" onClick={() => toggleSection('contact')}>
            Contact us <span>{openSection === 'contact' ? '-' : '+'}</span>
          </div>
          {openSection === 'contact' && (
            <ul>
              <li>Email: support@snaprent.com</li>
              <li>Phone: +91-9876543210</li>
            </ul>
          )}
        </div>

        <div className="collapsible-section">
          <div className="section-header" onClick={() => toggleSection('links')}>
            Quick Links <span>{openSection === 'links' ? '-' : '+'}</span>
          </div>
          {openSection === 'links' && (
            <ul>
              <li>About us</li>
              <li>Blog</li>
              <li>Careers</li>
              <li>FAQ</li>
              <li>Feedback</li>
            </ul>
          )}
        </div>

        <div className="collapsible-section">
          <div className="section-header" onClick={() => toggleSection('policy')}>
            Policies <span>{openSection === 'policy' ? '-' : '+'}</span>
          </div>
          {openSection === 'policy' && (
            <ul>
              <li>Terms of Use</li>
              <li>Privacy Policy</li>
              <li>Refund Policy</li>
            </ul>
          )}
        </div>

        <div className="collapsible-section">
          <div className="section-header" onClick={() => toggleSection('social')}>
            Socialize <span>{openSection === 'social' ? '-' : '+'}</span>
          </div>
          {openSection === 'social' && (
            <div className="social-icons">
              <i className="bx bxl-facebook"></i>
              <i className="bx bxl-instagram"></i>
              <i className="bx bxl-twitter"></i>
              <i className="bx bxl-linkedin"></i>
            </div>
          )}
        </div>

        <div className="register-btn">Register Rental Business</div>
        <div className="payment-icons">
          <img src="https://img.icons8.com/color/48/000000/visa.png" alt="visa" />
          <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="mc" />
          <img src="https://img.icons8.com/color/48/000000/rupay.png" alt="rupay" />
        </div>

        <div className="copyright">
          © 2025 <span>SnapRent.com</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
