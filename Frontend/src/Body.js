import React from "react";
import './Body.css'

function Body({ onCategoryClick }) {
  return (
    <div>
      <div className="search">
        <div className="child">
          <input type="text" id="searchinp" placeholder="Search" />
          <button type="button" id="srchbtn"><i className='bx bx-search'></i></button>
        </div>
      </div>
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
    </div>
  );
}

export default Body;