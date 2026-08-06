import React, { useEffect, useState } from "react";
import "./Navbar.scss";

const Navbar = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {

    const user = localStorage.getItem("loggedinuser");

    if(user){
      setIsLoggedIn(true);
    }

  }, []);



  const handleLogout = () => {

    localStorage.removeItem("loggedinuser");

    window.location.href = "/login";

  };


  return (
    <nav className="navbar">

      <h2>
      Nexterview AI    
      </h2>
   <p>  AI-Powered Interview Preparation Platform</p>



      {
        isLoggedIn && (
          <button onClick={handleLogout}>
            Logout
          </button>
        )
      }


    </nav>
  );
};


export default Navbar;