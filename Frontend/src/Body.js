import React from "react";
import './Body.css'
import Footer from "./Footer";

function Body({ onCategoryClick }) {
  return (
    <div>
      
      <br /><br />
      <h3 id="br" className="text-center my-4">Browse In Categories</h3>

      <div className="container">
        <div className="row text-center">

          <div className="col-6 col-md-3 mb-4">
            <div className="card h-100" onClick={() => onCategoryClick("Video")}>
              <img src="./videoeqp.jpeg" className="card-img-top img-fluid" style={{ height: '180px', objectFit: 'cover' }} alt="video" />
              <div className="card-body p-2">
                <div className="fw-bold text-dark text-decoration-none">Video Equipment</div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3 mb-4">
            <div className="card h-100" onClick={() => onCategoryClick("Audio")}>
              <img src="./audioeqp.jpeg" className="card-img-top img-fluid" style={{ height: '180px', objectFit: 'cover' }} alt="audio" />
              <div className="card-body p-2">
                <div className="fw-bold text-dark text-decoration-none">Audio Equipment</div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3 mb-4">
            <div className="card h-100" onClick={() => onCategoryClick("Office")}>
              <img src="./officeeqp.jpeg" className="card-img-top img-fluid" style={{ height: '180px', objectFit: 'cover' }} alt="office" />
              <div className="card-body p-2">
                <div className="fw-bold text-dark text-decoration-none">Office Equipment</div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3 mb-4">
            <div className="card h-100" onClick={() => onCategoryClick("Medical")}>
              <img src="./medicaleqp.jpeg" className="card-img-top img-fluid" style={{ height: '180px', objectFit: 'cover' }} alt="medical" />
              <div className="card-body p-2">
                <div className="fw-bold text-dark text-decoration-none">Medical Equipment</div>
              </div>
            </div>
          </div>

        </div>
      </div>
            <div className="why-choose-us my-5">
        <h2 className="text-center fw-bold mb-4">Why Choose Us</h2>
        <div className="container">
          <div className="row g-4">

            <div className="col-md-4 col-sm-6">
              <div className="feature-box p-4 text-center h-100 border rounded">
                <i className="bx bx-headphone fs-1 text-info mb-2"></i>
                <h5 className="fw-semibold">Customer Support</h5>
                <p>Our dedicated support team ensures that you have a smooth renting experience.</p>
              </div>
            </div>

            <div className="col-md-4 col-sm-6">
              <div className="feature-box p-4 text-center h-100 border rounded">
                <i className="bx bx-list-ul fs-1 text-info mb-2"></i>
                <h5 className="fw-semibold">Flexible Options</h5>
                <p>With a multitude of vendors, we make your renting experience tailored to suit you.</p>
              </div>
            </div>

            <div className="col-md-4 col-sm-6">
              <div className="feature-box p-4 text-center h-100 border rounded">
                <i className="bx bx-like fs-1 text-info mb-2"></i>
                <h5 className="fw-semibold">Quality Assured</h5>
                <p>Quality assured products from trusted vendors, quality that speaks for itself.</p>
              </div>
            </div>

            <div className="col-md-4 col-sm-6">
              <div className="feature-box p-4 text-center h-100 border rounded">
                <i className="bx bx-wallet fs-1 text-info mb-2"></i>
                <h5 className="fw-semibold">Pocket Friendly</h5>
                <p>Best deals on all your renting needs, never break a sweat over renting again.</p>
              </div>
            </div>

            <div className="col-md-4 col-sm-6">
              <div className="feature-box p-4 text-center h-100 border rounded">
                <i className="bx bx-shield-check fs-1 text-info mb-2"></i>
                <h5 className="fw-semibold">Verified Vendors</h5>
                <p>Vendors on the portal are verified to avoid fraudulent practices, to keep you safe.</p>
              </div>
            </div>

            <div className="col-md-4 col-sm-6">
              <div className="feature-box p-4 text-center h-100 border rounded">
                <i className="bx bx-up-arrow-alt fs-1 text-info mb-2"></i>
                <h5 className="fw-semibold">One Stop Solution</h5>
                <p>All your renting needs under one roof, delivered to you at just the click of a button.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer/>

    </div>
  );
}

export default Body;