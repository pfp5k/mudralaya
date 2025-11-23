import React, { useState } from 'react';
import './Benefits.css';

const Benefits = () => {
  const [selectedCard, setSelectedCard] = useState(null);

  const plans = [
    {
      badge: 'FREE',
      price: '₹ 0',
      benefits: [
        'Start with zero investment',
        'Earn from multiple financial products',
        'Weekly training for beginners',
        'Flexible work – home or field',
        'Unlimited earning potential',
        'Simple onboarding (18+ & 10th pass)'
      ],
      buttonText: 'CHOOSE PLAN',
      buttonColor: 'purple',
      cardClass: ''
    },
    {
      badge: 'INDIVIDUAL',
      price: '₹15,000–₹27,599',
      benefits: [
        'CRM access & verified leads',
        'Dedicated Relationship Manager',
        'Weekly training + daily feedback',
        'Digital presence setup',
        'Option for laptop, branding, website',
        'Minimum salary (KRA-based)'
      ],
      buttonText: 'CHOOSE PLAN',
      buttonColor: 'teal',
      cardClass: 'plan-card-individual'
    },
    {
      badge: 'FREE FRANCHISE',
      price: '₹ 0',
      benefits: [
        'Full CRM access (free)',
        'Salary support for team (KRA-based)',
        'Hiring support for calling staff',
        'Weekly leadership training',
        'Daily call feedback',
        'Add-on: 2 laptops (₹15,000 total)'
      ],
      buttonText: 'CHOOSE PLAN',
      buttonColor: 'purple',
      cardClass: ''
    },
    {
      badge: 'PAID FRANCHISE',
      price: '₹ Customise',
      benefits: [
        'Fully customizable pricing & tools',
        'CRM seats for full team',
        'Verified data packs',
        'Full office + team setup guidance',
        'RM support + performance coaching',
        'Branding, website & hiring support'
      ],
      buttonText: 'CHOOSE PLAN',
      buttonColor: 'black',
      cardClass: ''
    }
  ];

  const handleCardClick = (index) => {
    setSelectedCard(index);
    // Reset after animation
    setTimeout(() => {
      setSelectedCard(null);
    }, 300);
  };

  return (
    <section className="benefits-section">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="benefits-title">Benefits of Joining Mudralaya</h2>
          <p className="benefits-subtitle">
            Choose your plan based on your dream of becoming Entrepreneur
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {plans.map((plan, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-3">
              <div
                className={`plan-card ${plan.cardClass} ${selectedCard === index ? 'zoom-active' : ''}`}
                onClick={() => handleCardClick(index)}
              >
                <div className="plan-badge">{plan.badge}</div>
                <div className="plan-price">{plan.price}</div>
                <ul className="plan-benefits">
                  {plan.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
                <button className={`plan-button plan-button-${plan.buttonColor}`}>
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;

