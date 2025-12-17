import React from 'react';
import './Benefits.css';
import { useModal } from '../../context/ModalContext';

const plans = [
  {
    key: 'free',
    title: 'FREE',
    subtitle: '',
    price: '₹ 0',
    priceLabel: '',
    description: '',
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
    title: 'INDIVIDUAL',
    subtitle: '',
    price: '₹15,000–₹27,599',
    description: '',
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
    key: 'business-solution',
    title: 'BUSINESS SOLUTION',
    subtitle: '',
    price: '₹ 0',
    description: '',
    benefits: [
      'We understand your goals and create custom tasks.',
      'Industry-specific tasks for leads, marketing, and outreach.',
      'Training videos for easy execution.',
      'Verified partners for surveys and follow-ups.',
      'Tech, sales, and service support included.',
      'Affordable, scalable solutions for every business.'
    ],
    variant: 'franchise'
  },
  {
    key: 'startup-launch-lab',
    title: 'STARTUP LAUNCH LAB',
    subtitle: '',
    price: '₹ Customise',
    description: '',
    benefits: [
      'Understand your idea and build a tailored business model.',
      'Market research and competitor analysis included.',
      'Branding, tech development, and website/app setup.',
      'Support across ideation, strategy, product, and marketing.',
      'Go-to-market execution with dedicated startup mentor.',
      'End-to-end guidance from idea to launch.'
    ],
    variant: 'paid'
  }
];

const Benefits = () => {
  const [selectedPlan, setSelectedPlan] = React.useState('individual');
  const [hasLaptop, setHasLaptop] = React.useState(false);
  const { openJoinUsModal } = useModal();

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
              <div
                className={`plan-card ${plan.variant} ${selectedPlan === plan.key ? 'active' : ''}`}
                onClick={() => setSelectedPlan(plan.key)}
              >
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
                  <div className="price-value">
                    {plan.variant === 'individual'
                      ? (hasLaptop ? '₹ 5,000' : '₹ 25,000')
                      : plan.price}
                  </div>
                </div>
                <ul className="plan-benefits">
                  {plan.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>

                {plan.variant === 'individual' && (
                  <div className="laptop-checkbox-container" onClick={(e) => e.stopPropagation()}>
                    <label className="custom-checkbox">
                      <input
                        type="checkbox"
                        checked={hasLaptop}
                        onChange={(e) => setHasLaptop(e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      I have my own Laptop
                    </label>
                  </div>
                )}

                <div className="plan-divider" />
                <button
                  className={`plan-button ${plan.variant}-btn`}
                  onClick={(e) => {
                    e.stopPropagation();
                    openJoinUsModal(plan.key);
                  }}
                >
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
