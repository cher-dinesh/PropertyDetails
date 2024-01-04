// Navbar.js

import React, { useState } from 'react';
import Image from '../Assets/logo.jpg';
import './Navbar.css';

const Navbar = () => {
  const [showNav, setShowNav] = useState(false);

  const toggleNav = () => {
    setShowNav(!showNav);
  };

  return (
    <nav className={`nav-container ${showNav ? 'mobile-nav' : ''}`}>
      <div className='profile-container'>
        <img
          src={Image}
          className="profile-pic"
          alt="profile picture"
        />
      </div>
      <div className="nav-list">
        <ul className={`nav-items ${showNav ? 'show' : ''}`}>
          <li><a href="/">Home</a></li>
          <li><a href="/properties">Properties</a></li>
          <li><a href="/agents">Agents</a></li>
          <li><a href="/contacts">Contacts</a></li>
        </ul>
      </div>
      <div className="symbol" onClick={toggleNav}>☰</div>
    </nav>
  );
};

export default Navbar;
