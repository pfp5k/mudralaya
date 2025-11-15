import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container mt-5">
        <div className="row align-items-center g-4">
          <div className="col-12 col-lg-8">
            <h1>Turn Every Conversation <br />into <span className="accent">Opportunity</span></h1>
            <p className="lead-muted mt-3">
              Work your way, earn without limits, and build your digital career as a Mudralaya Advisor
            </p>
            <div className="d-flex align-items-center gap-3 mt-3">
              <Link to="/advisor" className="btn btn-primary btn-lg mt-3" id="becomeBtn">
                Become our Advisor
              </Link>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="mock-card">
              <div className="text-center">
                <img 
                  src="/images/advisor-img.png" 
                  alt="Advisor image" 
                  className="img-fluid hero-img"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400?text=Advisor';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

