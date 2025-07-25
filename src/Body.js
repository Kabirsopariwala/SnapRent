import React from "react";
import './Body.css'

function Body()
{
    return(
        <body>
        <div>
            <div className="search">
                <div className="child">
            <input type="text" id="searchinp" placeholder="Search"></input>
                <button type="button" id="srchbtn"><i class='bx  bx-search'  ></i> </button>
        </div>
        </div>
        <br></br><br></br>
            <h3 id="br">Browse In Categories</h3>
            <div className="categories">
                <table className="table">
                    <tr>
                        <td>
                <img src="./videoeqp.jpeg" alt="image 1" className="img-fluid"></img>
                </td>
                    <td>
                <img src="./audioeqp.jpeg" alt="image 2" className="img-fluid"></img>
                </td>
                <td>
                <img src="./officeeqp.jpeg" alt="image 3" className="img-fluid"></img>
                </td>
                <td>
                <img src="./medicaleqp.jpeg" alt="image 4" className="img-fluid"></img>
                </td>
                </tr>
                <tr>
                    <td><a href="#">video equipment</a></td>
                    <td><a href="#">audio equipment</a></td>
                    <td><a href="#">office equipment</a></td>
                    <td><a href="#">Medical equipment</a></td>
                </tr>
                </table>
            </div>
        </div>
        </body>
        
    );
}

export default Body;