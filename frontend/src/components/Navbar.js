import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          AI Health Chain
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <a
              href="https://www.aihealthchains.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="navbar-link"
            >
              Contact Us
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
