import React, { useState } from "react";
// import logo from "../assets/logo2.jpg";
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import { Link } from "react-router-dom";
// import CreateNotification from "./CreateNotification";

export default function AdminNavBar() {
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const togglePopup = () => setIsPopupOpen(!isPopupOpen);


  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-4">
        <div className="flex justify-between h-36 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-start">
              {/* <img
                src={logo}
                alt="Logo"
                className="h-30 w-30"
              /> */}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
