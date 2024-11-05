import React, { useEffect, useState } from "react";
import { useNavigate, Link, useRouteError } from "react-router-dom";
import "./styles/Header.css"

function Header({ onLogout })
   {
    const navigate = useNavigate();
    const [isDropDown, setIsDropDown] = useState(false);

    const handleAccountClick = () => {
       setIsDropDown((prev) => !prev);
      };

    const handleLogout = () => {
       onLogout();
      };

    const handleAccountView = () => {
      navigate("/Account");
      handleAccountClick();
    }

    return (
      <div className="Header-Bar">
         <div onClick={() => navigate("/")} className="Home-Icon">
         <h1>The Blog</h1>
         </div>
         {!isDropDown && ( 
            <div onClick={handleAccountClick} className={"Account-Icon"}>
               <h4>Account</h4>
            </div>
         )}
         
         {isDropDown && (
            <div className="Dropdown-Menu">
               <ul>
                  <li onClick={handleAccountClick}>Account</li>
                  <li onClick={handleAccountView}>Go To Account</li>
                  <li onClick={handleLogout}>Logout</li>
               </ul>
            </div>
         )}
      </div>
    )
   }

export default Header