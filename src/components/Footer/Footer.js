import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle email subscription
    console.log('Email subscription:', email);
    setEmail('');
    alert('Thank you for subscribing!');
  };

  return (
    <footer className="site-footer">
      <div className="container-fluid">
        <div className="row gy-4">
          <div className="col-lg-4 col-md-4 m-0 mb-3">
            <div className="mb-3">
              <img 
                src="/images/mudralya_logo.webp" 
                alt="Mudralaya Fintech Logo" 
                style={{ height: '80px', width: 'auto', filter: 'brightness(0) invert(1)' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150x80?text=Mudralaya';
                }}
              />
              <div style={{ fontWeight: 700, fontSize: '1.5rem' }}>Mudralaya Fintech</div>
            </div>

            <div className="small text-white-50">
              Copyright © 2020 Nexcent ltd.
            </div>
            <div className="small text-white-50">
              All rights reserved
            </div>

            <div className="d-flex gap-2 mt-3">
              <a href="#" className="social-icon" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-icon" aria-label="Telegram">
                <i className="fab fa-telegram-plane"></i>
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-4 col-md-4">
            <div className="row">
              <div className="col-6">
                <h6>Company</h6>
                <ul className="list-unstyled small">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/about">About us</Link></li>
                  <li><Link to="/contact">Contact us</Link></li>
                </ul>
              </div>
              <div className="col-6">
                <h6>Support</h6>
                <ul className="list-unstyled small">
                  <li><a href="#help">Help center</a></li>
                  <li><a href="#terms">Terms of service</a></li>
                  <li><a href="#legal">Legal</a></li>
                  <li><a href="#privacy">Privacy policy</a></li>
                  <li><a href="#status">Status</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-4">
            <div>
              <h6>Stay up to date</h6>
              <form className="d-flex" onSubmit={handleSubmit}>
                <div className="input-group">
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="Your email address" 
                    aria-label="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button className="btn btn-primary" type="submit" aria-label="Subscribe">
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

