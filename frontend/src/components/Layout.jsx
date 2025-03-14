import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import '../styles/theme.css';
import logo from '../assets/logo3.png';

const Layout = () => {
    return (
        <div className="layout">
            <header className="header">
                <Link to="/" className="header-title">
                    <h1 className="logo">
                        Changel
                        <img src={logo} alt="O" className="logo-icon" />
                        g Generat
                        <img src={logo} alt="O" className="logo-icon" />
                        r
                    </h1>
                </Link>
                <nav>
                    <ul>
                        <li><Link to="/developer">Developer Tool</Link></li>
                        <li><Link to="/public">Public View</Link></li>
                    </ul>
                </nav>
            </header>
            <main className="content">
                <Outlet />
            </main>
            <footer className="footer">
                <p>© 2025 Changelog Generator</p>
            </footer>
        </div>
    );
};

export default Layout;