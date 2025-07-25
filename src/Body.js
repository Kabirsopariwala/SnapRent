import React from "react";
import './Body.css'

function Body()
{
    return(
        
        <div>
            <div className="search">
                <div className="child">
            <input type="text" id="searchinp" placeholder="Search"></input>
                <button type="button" id="srchbtn"><i class='bx  bx-search'  ></i> </button>
        </div>
        </div>
        <br></br><br></br>
            <h3 id="br" className="text-center my-4">Browse In Categories</h3>
<div className="container">
  <div className="row text-center">

    
    <div className="col-6 col-md-3 mb-4">
      <div className="card h-100">
        <img src="./videoeqp.jpeg" className="card-img-top img-fluid" style={{ height: '180px', objectFit: 'cover' }} alt="video" />
        <div className="card-body p-2">
          <a href="#" className="fw-bold text-dark text-decoration-none">video equipment</a>
        </div>
      </div>
    </div>

   
    <div className="col-6 col-md-3 mb-4">
      <div className="card h-100">
        <img src="./audioeqp.jpeg" className="card-img-top img-fluid" style={{ height: '180px', objectFit: 'cover' }} alt="audio" />
        <div className="card-body p-2">
          <a href="#" className="fw-bold text-dark text-decoration-none">audio equipment</a>
        </div>
      </div>
    </div>

    <div className="col-6 col-md-3 mb-4">
      <div className="card h-100">
        <img src="./officeeqp.jpeg" className="card-img-top img-fluid" style={{ height: '180px', objectFit: 'cover' }} alt="office" />
        <div className="card-body p-2">
          <a href="#" className="fw-bold text-dark text-decoration-none">office equipment</a>
        </div>
      </div>
    </div>

  
    <div className="col-6 col-md-3 mb-4">
      <div className="card h-100">
        <img src="./medicaleqp.jpeg" className="card-img-top img-fluid" style={{ height: '180px', objectFit: 'cover' }} alt="medical" />
        <div className="card-body p-2">
          <a href="#" className="fw-bold text-dark text-decoration-none">Medical equipment</a>
        </div>
      </div>
    </div>

  </div>
</div>

        </div>
        
        
    );
}

export default Body;