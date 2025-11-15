import React from 'react';
import { Link } from 'react-router-dom';

const EmpoweringWomen = () => {
  return (
    <section className="women-strip">
      <div className="container py-5">
        <div className="row align-items-center justify-content-center g-5">
          <div className="col-12 col-lg-6 text-center text-lg-end">
            <div className="strip-content ms-lg-auto me-lg-0 mx-auto">
              <h2 className="mb-3">
                Empowering <span style={{ color: 'var(--brand)' }}>Women.</span> <br />
                <span className="text-brand">Building Futures</span>
              </h2>
              <p className="text-muted fs-6 mb-4">
                Join a powerful network of women advisors shaping the future of financial freedom in India
              </p>
            </div>
          </div>

          <div className="col-12 col-lg-6 text-center text-lg-start">
            <div className="d-flex flex-column align-items-center align-items-lg-start strip-graphic ms-lg-0 mx-auto">
              <div className="image-card-effect">
                <img 
                  src="/images/Empowering_Women.webp" 
                  alt="Empowering Women" 
                  className="img-fluid hero-img"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=Empowering+Women';
                  }}
                />
              </div>
              <Link to="/advisor" className="btn-cta text-decoration-none mt-3">
                Become our Advisor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmpoweringWomen;

