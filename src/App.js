import React from "react";
import Header from "./Header"
import "./App.css"
import Body from "./Body"
function App()
{
  return(
    
    <div id="content">
       <h1 id="title">Welcome to SnapRent</h1>
      <Header />
      
      <p id="tagline">Rent gear and gadgets anytime !</p>
       <Body/>
    </div>
   
  );
}

export default App;