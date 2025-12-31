import React from 'react';
import { MdPlayArrow, MdTrendingUp, MdAccountBalanceWallet, MdGroup, MdContentCopy } from 'react-icons/md';
import { FaHandHoldingUsd } from 'react-icons/fa'; // Need to ensure react-icons/fa is available or use alternatives
import { useUser } from '../context/UserContext';
import './DashboardHome.css';

const DashboardHome = () => {
    const { profile } = useUser();
    const fullName = profile?.full_name || 'User';

    return (
        <div className="dashboard-home">
            {/* Welcome Section */}
            <div className="welcome-section">
                <div>
                    <h1 className="welcome-title">Welcome Back {fullName}</h1>
                    <p className="welcome-subtitle">Start your task to earn!</p>
                </div>
                <button className="guidance-btn">
                    <span>Earning Guidance</span>
                    <div className="play-icon-wrapper">
                        <MdPlayArrow />
                    </div>
                </button>
            </div>

            {/* Earnings Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <h3>Today's Earning</h3>
                        <span>:</span>
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">₹ 200</div>
                        <div className="stat-icon-bg icon-money-hand">
                            <FaHandHoldingUsd />
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <h3>Monthly Earning</h3>
                        <span>:</span>
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">₹ 20,000</div>
                        <div className="stat-icon-bg icon-graph">
                            <MdTrendingUp />
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <h3>Total Earning</h3>
                        <span>:</span>
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">₹ 60,000</div>
                        <div className="stat-icon-bg icon-wallet">
                            <MdAccountBalanceWallet />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Grid: Ongoing Task & Tasks List */}
            <div className="dashboard-grid">

                {/* Left Column */}
                <div className="dashboard-column">
                    {/* Ongoing Task */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3>Ongoing Task</h3>
                            <span>:</span>
                        </div>
                        <div className="ongoing-task-card">
                            <div className="task-info-row">
                                <div className="task-icon-circle blue-gradient">
                                    <MdGroup />
                                </div>
                                <div className="task-details">
                                    <h4>Join Members for Mudralaya</h4>
                                    <p>Daily Task</p>
                                </div>
                                <span className="expand-icon">^</span>
                            </div>

                            <div className="task-rewards-row">
                                <span>Task Reward</span>
                                <div className="rewards">
                                    <div className="reward-item member">
                                        <span className="badge-label member">Members</span>
                                        <span className="amount">$ 40</span>
                                    </div>
                                    <div className="reward-item free">
                                        <span className="badge-label free">Free</span>
                                        <span className="amount">$ 30</span>
                                    </div>
                                </div>
                            </div>

                            <div className="task-actions-row">
                                <button className="btn-view-details">View Details</button>
                                <button className="btn-copy-code">
                                    <span>MF250E</span>
                                    <MdContentCopy />
                                </button>
                            </div>
                        </div>

                        <div className="ongoing-task-card minimized">
                            <div className="task-info-row">
                                <img src="/mudralaya_logo_only.png" alt="MF" className="task-brand-icon"
                                    onError={(e) => { e.target.src = 'https://placehold.co/20'; }} />
                                <div className="task-details">
                                    <h4>Maximize Download for Mudralaya App</h4>
                                    <p>Weekly Task</p>
                                </div>
                                <span className="status-text in-progress">In progress..</span>
                                <span className="expand-icon">v</span>
                            </div>
                        </div>
                    </div>

                    {/* Leaderboard */}
                    <div className="dashboard-card full-height">
                        <div className="card-header">
                            <h3>Leaderboard</h3>
                            <span>:</span>
                        </div>
                        <div className="empty-state">
                            <p>Coming Soon</p>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="dashboard-column">
                    {/* Tasks List */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3>Tasks</h3>
                            <span>:</span>
                        </div>
                        <div className="tasks-list">
                            {[1, 2, 3].map((item, index) => (
                                <div key={index} className="task-list-item">
                                    <div className="task-item-left">
                                        <div className={`task-icon-circle ${index % 2 === 0 ? 'blue-gradient' : 'purple-gradient'}`}>
                                            {index % 2 === 0 ? <MdGroup /> : <MdContentCopy />}
                                        </div>
                                        <div className="task-details">
                                            <h4>{index % 2 === 0 ? "Join Members for Mudralaya" : "Maximize Download for Mudra..."}</h4>
                                            <p>{index % 2 === 0 ? "Daily Task" : "Weekly Task"}</p>
                                        </div>
                                    </div>
                                    <button className="btn-price">
                                        ₹ 600
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="dashboard-card full-height">
                        <div className="card-header">
                            <h3>Notifications</h3>
                            <span>:</span>
                        </div>
                        <div className="empty-state">
                            {/* Empty content */}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardHome;
