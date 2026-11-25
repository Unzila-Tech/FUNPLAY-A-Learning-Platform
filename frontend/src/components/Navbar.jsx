import React from "react";
import { Link } from "react-router-dom";
function Navbar() {
  return (
    <nav className="navbar">

      {/* Logo */}
      <div className="logo">
        <img src="images/logo.png" alt="Logo" />
      </div>

      {/* Navigation Links */}
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>

        <Link to="/register" className="register-btn">
          Register
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;