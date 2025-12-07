import React from 'react';

const EmpoweringWomen = () => {
  return (
    <section className="women-strip">
      <div className="container py-5">
        <div className="row align-items-center g-5">
          {/* Left Side - Image with Card Effect */}
          <div className="col-12 col-lg-6 text-center text-lg-start">
            <div className="d-flex justify-content-center justify-content-lg-start">
              <div className="image-card-effect">
                <img 
                  src="/images/women.png" 
                  alt="Women Empowerment" 
                  className="img-fluid"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400?text=Women+Empowerment';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Side - Text Quotes */}
          <div className="col-12 col-lg-6">
            <div className="women-quotes">
              <p className="quote-text">
                "Your financial independence starts here."
              </p>
              <p className="quote-text">
                "Women leading India's financial future."
              </p>
              <p className="quote-text">
                "Start small, grow big with Mudralaya."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmpoweringWomen;

