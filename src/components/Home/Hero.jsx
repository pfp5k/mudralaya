import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="container-fluid hero-container">
        <div className="row g-0 align-items-center">
          {/* Left Section - Text Content */}
          <div className="col-12 col-lg-6 hero-left">
            <div className="hero-content">
              {/* Trust Badge */}
              <div className="trust-badge">
                <span className="badge-icon">✓</span>
                <span className="badge-text">100% TRUSTED PLATFORM</span>
              </div>
              
              {/* Main Headline */}
              <h1 className="hero-headline">
                Choose Your Tasks.<br />
                Earn Your Way.<br />
                Zero Investment.
              </h1>
              
              {/* Sub-headline */}
              <p className="hero-subheadline">
                
Get daily, weekly & monthly tasks from multiple companies—select what suits you and start earning instantly.
              </p>
              
              {/* CTA Buttons */}
              <div className="hero-buttons">
                <Link to="/plans" className="btn btn-explore">
                  Explore Plans
                </Link>
                <Link to="/advisor" className="btn btn-advisor">
                  Start Earning
                </Link>
              </div>
            </div>
          </div>

          {/* Right Section - Image */}
          <div className="col-12 col-lg-6 hero-right">
            <div className="hero-image-wrapper">
              <img 
                src="/images/banner-2.png" 
                alt="Business professionals" 
                className="hero-main-image"
                onError={(e) => {
                  e.target.src = '/images/banner-2.png';
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

