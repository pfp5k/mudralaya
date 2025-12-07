import React from 'react';
import './Benefits.css';

const plans = [
  {
    key: 'free',
    title: 'Partner Program',
    price: '₹ 0',
    benefits: [
      'Partner (Task-Based Earnings)
',
      'Start with zero investment',
      'Start with zero investment',
      'Access to daily/weekly/monthly tasks',
      'Earn by completing tasks from multiple companies',
      'Flexible work - home or on-field',
      'Unlimited earning potential',
      'Simple onboarding (18+)',
      'Ideal for students, homemakers & part-time earners'
    ],
    variant: 'free'
  },
  {
    key: 'individual',
    title: 'Full-Time Partner',
    price: '₹15,000-₹27,599',
    benefits: [
      'CRM access & verified leads',
      'Dedicated Relationship Manager',
      'Weekly training + daily feedback',
      'Digital presence setup',
      'Option for laptop, branding, website',
      'Minimum salary (KRA-based)'
    ],
    variant: 'individual'
  },
  {
    key: 'free-franchise',
    title: 'FREE FRANCHISE',
    price: '₹ 0',
    benefits: [
      'Full CRM access (free)',
      'Salary support for team (KRA-based)',
      'Hiring support for calling staff',
      'Weekly leadership training',
      'Daily call feedback',
      'Add-on: 2 laptops (₹15,000 total)'
    ],
    variant: 'franchise'
  },
  {
    key: 'paid-franchise',
    title: 'PAID FRANCHISE',
    price: '₹ Customise',
    benefits: [
      'Fully customizable pricing & tools',
      'CRM seats for full team',
      'Verified data packs',
      'Full office + team setup guidance',
      'RM support + performance coaching',
      'Branding, website & hiring support'
    ],
    variant: 'paid'
  }
];

const Benefits = () => {
  return (
    <section className="benefits-section">
      <div className="container benefits-container">
        <div className="text-center benefits-header">
          <h2 className="benefits-title">Benefits of Joining Mudralaya</h2>
          <p className="benefits-subtitle">
            Choose your plan based on your dream of becoming Entrepreneur
          </p>
        </div>

        <div className="row g-4 benefits-grid benefits-grid-surface">
          {plans.map((plan) => (
            <div key={plan.key} className="col-12 col-md-6 col-lg-3">
              <div className={`plan-card ${plan.variant}`}>
                {plan.variant !== 'individual' && (
                  <div className="plan-badge">{plan.title}</div>
                )}
                <div
                  className={`plan-price ${
                    plan.variant === 'individual' ? 'price-pill has-label' : ''
                  }`}
                >
                  {plan.variant === 'individual' && (
                    <div className="price-label">{plan.title}</div>
                  )}
                  <div className="price-value">{plan.price}</div>
                </div>
                <ul className="plan-benefits">
                  {plan.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
                <div className="plan-divider" />
                <button className={`plan-button ${plan.variant}-btn`}>
                  CHOOSE PLAN
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
