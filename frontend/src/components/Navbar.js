import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../logo.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="AI Health Chain" className="navbar-logo-image" />
          <span className="navbar-logo-text">AI Health Chain</span>
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
