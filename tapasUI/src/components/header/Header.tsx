import React from 'react'
import './Header.css'
import logo from '../../pictures/logo.png'

/**
 * Header component for the top of the page.
 * @returns {Element}
 */

const Header: React.FC = () => {
    return (
        <header className='header'>
            <img src={logo} alt="Logo" className='header-logo'/>
            <div className='header-text'>
                <h1>Tapas Johtamisavustin</h1>
            </div>     
      </header>
    );
  };

export default Header;