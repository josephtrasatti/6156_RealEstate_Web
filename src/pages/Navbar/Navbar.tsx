import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuItems } from '../../models/MenuItems';
import './Navbar.css';

export const Navbar = () => {

    const [isClicked, setIsClicked] = useState(false);

    const updateMenuBar = () => [
        setIsClicked(!isClicked)
    ]

    return (
        <nav className="NavbarItems">
            <Link className='navbar-link' to='/'>
                <h1 className="navbar-logo">RealEstate</h1>
            </Link>
            <div className="menu-icon" onClick={updateMenuBar}>
                <i className={isClicked ? 'fas fa-times' : 'fas fa-bars'}></i>
            </div>
            <ul className={isClicked ? 'nav-menu active' : 'nav-menu'}>
                {MenuItems.map((item, index) => {
                    return (
                        <li key={index}>
                            <a className={item.cName} href={item.url}>
                                {item.title}
                            </a>
                        </li>
                    )
                })} 
            </ul>
        </nav>
    )
}