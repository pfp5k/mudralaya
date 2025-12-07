import React from 'react';
import './Benefits.css';

const plans = [
  {
    key: 'free',
    title: 'PARTNER',
    subtitle: 'Task-Based Earnings',
    price: '₹ 0',
    priceLabel: 'Free to Join',
    description: 'For people who want to earn by completing daily, weekly & monthly tasks.',
    benefits: [
      'Start with zero investment',
      'Access to daily / weekly / monthly tasks',
      'Earn by completing tasks from multiple companies',
      'Flexible work — home or on-field',
      'Unlimited earning potential',
      'Simple onboarding (18+)',
      'Ideal for students, homemakers & part-time earners'
    ],
    variant: 'free'
  },
  {
    key: 'individual',
    title: 'FULL-TIME PARTNER',
    subtitle: 'Professional Growth',
    price: '₹15,000-₹27,599',
    description: 'For individuals who want to work full-time & earn a stable income',
    benefits: [
      'Maximum task opportunities from top brands & companies',
      'Weekly training sessions',
      'Dedicated Relationship Manager for guidance',
      'Daily review & performance improvement',
      'Fix salary support up to ₹50,000 (performance-based)',
      'Strong digital presence setup',
      'Priority access to high-paying tasks',
      'Fast-track growth to Skilled Partner → Entrepreneur'
    ],
    variant: 'individual'
  },
  {
    key: 'business',
    title: 'BUSINESS SOLUTIONS',
    subtitle: 'For Business Owners',
    price: '₹ 0',
    description: 'For companies who want complete business tasks executed through Mudralaya',
    benefits: [
      'We understand your business concept & goals',
      'Create customized tasks based on your industry',
      'Training videos for each task for perfect execution',
      'Assign tasks to verified & skilled partner network',
      'Lead generation, promotion & marketing support',
      'Surveys, customer feedback & outreach',
      'Tech, marketing, sales & service support included',
      'Dedicated business manager for coordination'
    ],
    variant: 'franchise'
  },
  {
    key: 'startup',
    title: 'STARTUP LAUNCH',
    subtitle: 'For Aspiring Entrepreneurs',
    price: '₹ Customise',
    description: 'For individuals who want to build and launch their own startup',
    benefits: [
      'We understand your idea, vision & long-term goals',
      'Create a complete business model for your concept',
      'Market research & competitor analysis',
      'Branding, tech development & website/app setup',
      'Ideation, validation, strategy & planning',
      'Product development & marketing setup',
      'Go-to-market execution support',
      'Dedicated startup mentor for step-by-step guidance'
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
                  className={`plan-price ${plan.variant === 'individual' ? 'price-pill has-label' : ''
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
