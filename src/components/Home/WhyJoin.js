import React from 'react';

const WhyJoin = () => {
  const features = [
    {
      icon: 'fa-briefcase',
      title: 'Entrepreneurship for All',
      description: 'Start earning from home and grow at your pace'
    },
    {
      icon: 'fa-user',
      title: 'Women-Focused',
      description: 'Designed to support women restarting careers or seeking financial independence'
    },
    {
      icon: 'fa-dollar-sign',
      title: 'Zero-Investment Options',
      description: 'Begin without spending anything'
    },
    {
      icon: 'fa-rocket',
      title: 'Multi-Product Earnings',
      description: 'Sell credit cards, loans, insurance & more'
    },
    {
      icon: 'fa-laptop',
      title: 'Training & Skill Growth',
      description: 'Weekly sessions with daily guidance'
    },
    {
      icon: 'fa-handshake',
      title: 'Step-by-Step Growth Path',
      description: 'From Individual → Premium → Franchise'
    }
  ];

  return (
    <section className="why-section">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="why-join-title">
            Why Join <span className="why-join-accent">Mudralaya?</span>
          </h2>
          <p className="why-join-subtitle">Work Smart. Earn Big. Live Free.</p>
        </div>

        <div className="row gy-4">
          {features.map((feature, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4">
              <div className="card-feature h-100">
                <div className="icon-box">
                  <i className={`fas ${feature.icon}`}></i>
                </div>
                <div className="card-content-wrapper">
                  <h5 className="mb-1">{feature.title}</h5>
                  <p className="mb-0 text-muted small">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyJoin;

