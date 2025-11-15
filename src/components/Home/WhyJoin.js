import React from 'react';

const WhyJoin = () => {
  const features = [
    {
      icon: '💼',
      title: 'Freedom to work your way',
      description: 'Choose your own hours, work from anywhere, and balance life on your terms.'
    },
    {
      icon: '💰',
      title: 'Unlimited earning potential',
      description: 'Get paid for every policy you sell and enjoy extra income when your team performs.'
    },
    {
      icon: '📦',
      title: 'Offer Every Product',
      description: 'Represent 250+ insurance plans — from life and health to motor and business coverage.'
    },
    {
      icon: '🎓',
      title: 'Guided Learning Path',
      description: 'No experience? No problem. Get training, certification, and mentorship support.'
    },
    {
      icon: '🖥️',
      title: 'Smart digital tools',
      description: 'Use our all-in-one advisor dashboard to manage clients, leads, and earnings on the go.'
    },
    {
      icon: '🤝',
      title: 'Build Your Brand',
      description: 'Create your own identity, gain clients\' trust, and grow as a professional financial advisor.'
    }
  ];

  return (
    <section className="why-section">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Why Join <span style={{ color: 'var(--brand)' }}>Mudralaya?</span></h2>
          <div className="text-muted">Work Smart. Earn Big. Live Free.</div>
        </div>

        <div className="row gy-4">
          {features.map((feature, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4">
              <div className="card-feature h-100">
                <div className="icon-box">{feature.icon}</div>
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

