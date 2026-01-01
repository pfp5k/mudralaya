import React, { useState } from 'react';
import './Plans.css';

const Plans = () => {
    const [hasLaptop, setHasLaptop] = useState(false);

    const plans = [
        {
            id: 1,
            name: 'FREE',
            price: 0,
            features: [
                "Start with zero investment",
                "Access to daily / weekly / monthly tasks",
                "Earn by completing tasks from multiple companies",
                "Flexible work — home or on-field",
                "Unlimited earning potential",
                "Simple onboarding (18+)",
                "Ideal for students, homemakers & part-time earners"
            ],
            type: 'purple',
            badgeType: 'pill',
            hasSeparator: true,
            buttonText: 'ENROLLED ALREADY',
            buttonStyle: 'outline'
        },
        {
            id: 2,
            name: 'INDIVIDUAL',
            price: 25000,
            features: [
                "Maximum task opportunities from top brands & companies",
                "Weekly training sessions",
                "Dedicated Relationship Manager for guidance",
                "Daily review & performance improvement",
                "Fix salary support up to ₹50,000 (performance-based)",
                "Strong digital presence setup",
                "Priority access to high-paying tasks",
                "Fast-track growth to Skilled Partner + Entrepreneur",
                "Up to 25% more discount on referral"
            ],
            type: 'black',
            badgeType: 'wide',
            hasCheckbox: true,
            buttonText: 'CHOOSE PLAN',
            buttonStyle: 'cyan'
        },
        {
            id: 3,
            name: 'BUSINESS SOLUTION',
            price: 0,
            features: [
                "We understand your goals and create custom tasks.",
                "Industry-specific tasks for leads, marketing, and outreach.",
                "Training videos for easy execution.",
                "Verified partners for surveys and follow-ups.",
                "Tech, sales, and service support included.",
                "Affordable, scalable solutions for every business."
            ],
            type: 'purple',
            badgeType: 'wide',
            hasSeparator: true,
            buttonText: 'CHOOSE PLAN',
            buttonStyle: 'black'
        },
        {
            id: 4,
            name: 'STARTUP LAUNCH LAB',
            price: 'Customise',
            features: [
                "Understand your idea and build a tailored business model.",
                "Market research and competitor analysis included.",
                "Branding, tech development, and website/app setup.",
                "Support across ideation, strategy, product, and marketing.",
                "Go-to-market execution with dedicated startup mentor.",
                "End-to-end guidance from idea to launch."
            ],
            type: 'purple',
            badgeType: 'wide',
            hasSeparator: true,
            buttonText: 'CHOOSE PLAN',
            buttonStyle: 'black'
        }
    ];

    return (
        <div className="plans-page">
            <header className="plans-header">
                <h1>Mudralaya Plans</h1>
                <p className="subtitle">Choose a Right and best suitable plan for yourself and join Mudralaya</p>
            </header>

            <div className="plans-grid">
                {plans.map((plan) => (
                    <div key={plan.id} className={`plan-card card-${plan.type}`}>
                        <div className={`plan-badge badge-${plan.badgeType}`}>{plan.name}</div>

                        <div className="plan-price">
                            {plan.price === 'Customise' ? (
                                <><span>₹</span> Customise</>
                            ) : (
                                <><span>₹</span> {plan.price.toLocaleString()}</>
                            )}
                        </div>

                        <ul className="plan-features">
                            {plan.features.map((feature, i) => (
                                <li key={i}>{feature}</li>
                            ))}
                        </ul>

                        {plan.hasCheckbox && (
                            <>
                                <div className="separator-line"></div>
                                <label className="laptop-check">
                                    <input
                                        type="checkbox"
                                        checked={hasLaptop}
                                        onChange={(e) => setHasLaptop(e.target.checked)}
                                    />
                                    I have my Own Laptop
                                </label>
                                <div className="separator-line"></div>
                            </>
                        )}

                        {plan.hasSeparator && (
                            <div className="separator-line mb-3"></div>
                        )}

                        <button className={`plan-btn btn-${plan.buttonStyle}`}>
                            {plan.buttonText}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Plans;

