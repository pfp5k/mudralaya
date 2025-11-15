import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  const missionCards = [
    {
      gif: '/images/aboutus-1.gif',
      title: 'Simplifying access to lending, insurance, and finance through AI'
    },
    {
      gif: '/images/aboutus-2.gif',
      title: 'Promoting financial clarity and control with data-driven tools'
    },
    {
      gif: '/images/aboutus-3.gif',
      title: 'Bridging the gap between users and financial institutions seamlessly'
    }
  ];

  return (
    <div className="about-us-page">
      <section className="py-5 py-md-5 mt-5">
        <div className="container-xl px-4 px-lg-5">
          <div className="row g-5 align-items-center">
            <div className="col-md-7 col-lg-8 mb-4 mb-md-0">
              <h1 className="fw-bolder text-dark mb-3">
                About <span className="highlight-text">Us</span>
              </h1>
              
              <h2 className="h4 fw-semibold text-secondary mb-4">
                Empowering Financial Simplicity Through AI
              </h2>

              <p className="text-secondary fs-6 fs-md-5 lh-base mb-4">
                At Mudralaya Fintech, we're reimagining the way individuals and small businesses manage their finances. Our goal is simple — to make financial access 
                <span className="fw-bold highlight-text"> transparent, intelligent, and effortless</span> for everyone.
              </p>

              <p className="text-secondary fs-6 fs-md-5 lh-base">
                We are building an AI-powered platform that integrates lending, insurance, and money management into one seamless digital ecosystem. From comparing financial products to managing policies and claims, Mudralaya Fintech ensures users make smart, data-backed decisions with complete confidence
              </p>
            </div>
            
            <div className="col-md-5 col-lg-4 d-flex justify-content-center">
              <div className="ai-illustration-container w-100" style={{ maxWidth: '384px' }}>
                <div className="text-center w-100">
                  <img 
                    src="/images/aboutus.webp" 
                    className="img-fluid rounded" 
                    alt="AI Agent analyzing financial data"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=About+Us';
                    }}
                  />
                  <p className="text-muted mt-2 small fw-medium">AI Agent & Financial Data Visualization</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 py-md-5 mission-bg">
        <div className="container-xl px-4 px-lg-5">
          <div className="row mb-5 text-center">
            <div className="col-12">
              <h2 className="h1 fw-bolder text-dark mb-2">
                Our <span className="highlight-text">Mission</span>
              </h2>
              <p className="lead text-secondary mx-auto" style={{ maxWidth: '600px' }}>
                Empowering every individual to make smart, transparent, and confident financial decisions
              </p>
            </div>
          </div>

          <div className="row g-4 justify-content-center">
            {missionCards.map((card, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="mission-card shadow-sm">
                  <div className="icon-box">
                    <img 
                      src={card.gif} 
                      alt={`Mission ${index + 1}`}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/50x50?text=X';
                      }}
                    />
                  </div>
                  <h3 className="h5 fw-bold mb-2 text-dark">{card.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 py-md-5 vision-bg">
        <div className="container-xl px-4 px-lg-5">
          <div className="row mb-5 text-center">
            <div className="col-12">
              <h2 className="h1 fw-bolder text-dark mb-2">
                Our <span className="highlight-text">Vision</span>
              </h2>
              <p className="lead text-secondary mx-auto" style={{ maxWidth: '700px' }}>
                To create India's most trusted and intelligent digital finance ecosystem, where people can access lending, insurance, and money management tools effortlessly
              </p>
            </div>
          </div>

          <div className="row g-4 justify-content-center mb-5 timeline-container">
            <div className="col-md-4 timeline-step">
              <div className="timeline-icon">
                <i className="fa-solid fa-check"></i>
                <div className="timeline-connector"></div>
              </div>
              <p className="timeline-label text-dark">Without Bias</p>
            </div>

            <div className="col-md-4 timeline-step">
              <div className="timeline-icon">
                <i className="fa-solid fa-check"></i>
              </div>
              <p className="timeline-label text-dark">Confusion</p>
            </div>

            <div className="col-md-4 timeline-step">
              <div className="timeline-icon">
                <i className="fa-solid fa-check"></i>
              </div>
              <p className="timeline-label text-dark">Complexity</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

