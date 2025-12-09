import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import JoinUsModal from '../JoinUsModal/JoinUsModal.jsx';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isJoinUsModalOpen, setIsJoinUsModalOpen] = useState(false);
  const showDashboardLink = import.meta.env.VITE_SHOW_DASHBOARD_LINK === 'true';
  const location = useLocation();

  useEffect(() => {
    // Set active link based on current route
    const path = location.pathname;
    if (path === '/') setActiveLink('home');
    else if (path === '/about') setActiveLink('about');
    else if (path === '/contact') setActiveLink('contact');
    else if (path === '/dashboard') setActiveLink('dashboard');
    else setActiveLink('home');

    // Close mobile menu on route change
    setIsNavOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
    setIsNavOpen(false); // Close mobile menu when link is clicked
  };

  const openJoinUsModal = () => {
    setIsJoinUsModalOpen(true);
    setIsNavOpen(false);
  };

  return (
    <>
      <nav
        id="main-header"
        className={`navbar navbar-expand-md navbar-light fixed-top px-4 py-2 ${scrolled ? 'scrolled' : ''}`}
      >
        <div className="container-xl">
          <Link className="navbar-brand" to="/">
            <img
              src="/images/mudralya_logo.webp"
              className="header-logo"
              alt="Mudralya Logo"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150x60?text=Mudralaya';
              }}
            />
          </Link>

          <button
            className={`navbar-toggler border-0 shadow-none ${isNavOpen ? '' : 'collapsed'}`}
            type="button"
            onClick={() => setIsNavOpen(!isNavOpen)}
            aria-controls="navbarNav"
            aria-expanded={isNavOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse justify-content-end ${isNavOpen ? 'show' : ''}`} id="navbarNav">
            <ul className="navbar-nav align-items-center">
              <li className="nav-item">
                <Link
                  className={`nav-link mx-2 nav-animate-link ${activeLink === 'home' ? 'active' : ''}`}
                  to="/"
                  onClick={() => handleLinkClick('home')}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link mx-2 nav-animate-link ${activeLink === 'about' ? 'active' : ''}`}
                  to="/about"
                  onClick={() => handleLinkClick('about')}
                >
                  About Us
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link mx-2 nav-animate-link ${activeLink === 'contact' ? 'active' : ''}`}
                  to="/contact"
                  onClick={() => handleLinkClick('contact')}
                >
                  Contact Us
                </Link>
              </li>
              {showDashboardLink && (
                <li className="nav-item">
                  <Link
                    className={`nav-link mx-2 nav-animate-link ${activeLink === 'dashboard' ? 'active' : ''}`}
                    to="/dashboard"
                    onClick={() => handleLinkClick('dashboard')}
                  >
                    Dashboard
                  </Link>
                </li>
              )}
              <li className="nav-item ms-md-3 mt-2">
                <button
                  className="btn btn-join-us"
                  onClick={openJoinUsModal}
                >
                  Join us
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <JoinUsModal
        isOpen={isJoinUsModalOpen}
        onClose={() => setIsJoinUsModalOpen(false)}
      />
    </>
  );
};

export default Header;
