import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Plans.css';

const Plans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasLaptop, setHasLaptop] = useState(false);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const { data, error } = await supabase.functions.invoke('dashboard-api', {
                    body: { action: 'get-plans' }
                });
                if (error) throw error;
                setPlans(data || []);
            } catch (err) {
                console.error("Error fetching plans:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    if (loading) return <div className="loading">Loading Plans...</div>;

    const renderPrice = (plan) => {
        if (plan.name === 'Individual' && hasLaptop) {
            return `₹ 5,000`;
        }
        if (plan.price === 0) return '₹ 0';
        if (!plan.price) return '₹ Customise';
        return `₹ ${plan.price.toLocaleString()}`;
    };

    return (
        <div className="plans-page">
            <header className="plans-header">
                <h1>Mudralaya Plans</h1>
                <p className="subtitle">Choose a Right and best suitable plan for yourself and join Mudralaya</p>
            </header>

            <div className="plans-grid">
                {plans.map((plan) => (
                    <div key={plan.id} className={`plan-card ${plan.is_popular ? 'card-black' : 'card-purple-gradient'}`}>
                        {plan.is_popular ? (
                            <div className="plan-badge-wide-gradient">{plan.name.toUpperCase()}</div>
                        ) : (
                            <div className="plan-badge-pill">{plan.name.toUpperCase()}</div>
                        )}

                        <div className={`plan-price ${plan.is_popular ? 'large-price' : ''}`}>
                            {renderPrice(plan)}
                        </div>

                        <ul className="plan-features">
                            {plan.features?.map((feature, i) => (
                                <li key={i}>{feature}</li>
                            ))}
                        </ul>

                        {plan.name === 'Individual' && (
                            <label className="laptop-check">
                                <input
                                    type="checkbox"
                                    checked={hasLaptop}
                                    onChange={(e) => setHasLaptop(e.target.checked)}
                                /> I have my Own Laptop
                            </label>
                        )}

                        <button className={`plan-btn ${plan.is_popular ? 'btn-cyan' : 'btn-black'}`}>
                            {plan.name === 'Free' ? 'ENROLLED ALREADY' : 'CHOOSE PLAN'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Plans;

