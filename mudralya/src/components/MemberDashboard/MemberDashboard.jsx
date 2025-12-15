import React, { useState } from 'react';
import './MemberDashboard.css';

const MemberDashboard = () => {
    const [stats] = useState({
        earnings: '0.00',
        tasksCompleted: 0,
        referrals: 0
    });

    const [tasks] = useState([]); // Empty tasks

    return (
        <div className="member-dashboard">
            {/* Availability Banner */}
            <div className="dashboard-banner">
                <i className="fas fa-info-circle"></i>
                <span>Please Note: The full dashboard features will be available from <strong>1st of January</strong>.</span>
            </div>

            <div className="dashboard-header">
                <div className="welcome-text">
                    <h1>Welcome back, Partner!</h1>
                    <p>Here's your daily earninig overview</p>
                </div>
                <div className="date-badge">
                    {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card earnings">
                    <div className="stat-icon">
                        <i className="fas fa-wallet"></i>
                    </div>
                    <div className="stat-info">
                        <h3>Total Earnings</h3>
                        <p className="stat-value">₹ {stats.earnings}</p>
                    </div>
                </div>

                <div className="stat-card tasks">
                    <div className="stat-icon">
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="stat-info">
                        <h3>Tasks Completed</h3>
                        <p className="stat-value">{stats.tasksCompleted}</p>
                    </div>
                </div>

                <div className="stat-card referrals">
                    <div className="stat-icon">
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="stat-info">
                        <h3>Referrals</h3>
                        <p className="stat-value">{stats.referrals}</p>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="dashboard-content">
                <div className="tasks-section">
                    <div className="section-header">
                        <h2>Available Tasks</h2>
                    </div>

                    <div className="empty-tasks-state">
                        <div className="empty-icon">
                            <i className="fas fa-clipboard-list"></i>
                        </div>
                        <h3>No Tasks Available Right Now</h3>
                        <p>Tasks will be managed and will be assigned to partners through the <strong>admin dashboard</strong>.</p>
                        <p className="sub-text">Please check back later or contact support for assignments.</p>
                    </div>
                </div>

                <div className="referhal-section">
                    <div className="referral-card inactive">
                        <h3>Invite & Earn</h3>
                        <p className="inactive-text">The referral program is not active yet.</p>
                        <div className="coming-soon-badge">Coming Soon</div>
                        <p className="info-text">You will be notified once the referral program is live.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberDashboard;
