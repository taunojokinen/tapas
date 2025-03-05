import React from 'react'
import './Header.css'
import logo from '../../pictures/logo.png'

/**
 * Header component for the top of the page.
 * @returns {Element}
 */

const Header: React.FC = () => {
    return (
      <header>
        <h1>Tapas</h1>
        <h3>Johtamisavustin</h3>
        <img src={logo} alt="Logo" />
      </header>
    );
  };

export default Header;