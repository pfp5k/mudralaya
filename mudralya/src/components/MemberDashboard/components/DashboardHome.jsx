import React, { useEffect, useState } from 'react';
import './MemberDashboardLayout.css';
import { supabase } from '../../../supabaseClient';

const DashboardHome = () => {
    const [stats, setStats] = useState([
        { title: "Today's Earning", amount: '₹ 0', icon: 'fas fa-hand-holding-usd', color: 'info' },
        { title: 'Monthly Earning', amount: '₹ 0', icon: 'fas fa-chart-line', color: 'primary' },
        { title: 'Total Earning', amount: '₹ 0', icon: 'fas fa-wallet', color: 'success' }
    ]);

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data: res, error } = await supabase.functions.invoke('dashboard-api', {
                    body: { action: 'get-dashboard-summary' }
                });

                if (error) throw error;

                const { stats: s, tasks: t } = res;

                setStats([
                    { title: "Today's Earning", amount: `₹ ${s.today || 0}`, icon: 'fas fa-hand-holding-usd', color: 'info' },
                    { title: 'Monthly Earning', amount: `₹ ${s.monthly || 0}`, icon: 'fas fa-chart-line', color: 'primary' },
                    { title: 'Total Earning', amount: `₹ ${s.total || 0}`, icon: 'fas fa-wallet', color: 'success' }
                ]);

                setTasks(t || []);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="p-5 text-center">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard-home">
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">Welcome Back User</h2>
                    <p className="text-muted mb-0">Start your task to earn!</p>
                </div>
                <button className="btn btn-primary d-flex align-items-center gap-2">
                    Earning Guidance <i className="fas fa-play-circle"></i>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                {stats.map((stat, index) => (
                    <div className="col-md-4" key={index}>
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <h6 className="card-title text-muted mb-0">{stat.title}</h6>
                                    <i className="fas fa-ellipsis-v text-muted" style={{ cursor: 'pointer', fontSize: '0.8rem' }}></i>
                                </div>
                                <div className="d-flex justify-content-between align-items-end">
                                    <h3 className={`text-${stat.color} mb-0 fw-bold`}>{stat.amount}</h3>
                                    <div className={`icon-box bg-${stat.color} bg-opacity-10 text-${stat.color} rounded p-2`}>
                                        <i className={`${stat.icon} fa-lg`}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                {/* Left Column: Ongoing Task */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 text-success fw-bold">Ongoing Task</h5>
                            <i className="fas fa-ellipsis-v text-muted"></i>
                        </div>
                        <div className="card-body">
                            {/* Expanded Task Item */}
                            <div className="border rounded p-3 mb-3">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="d-flex gap-3">
                                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                                            <i className="fas fa-user-friends"></i>
                                        </div>
                                        <div>
                                            <h6 className="mb-0 fw-bold">Join Members for Mudralaya</h6>
                                            <small className="text-muted">Daily Task</small>
                                        </div>
                                    </div>
                                    <i className="fas fa-chevron-up text-muted"></i>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="text-muted">Task Reward</span>
                                    <div className="text-end">
                                        <div className="d-flex gap-2 justify-content-end mb-1">
                                            <span className="badge bg-warning text-dark">Members</span>
                                            <span className="badge bg-info text-dark">Free</span>
                                        </div>
                                        <div>
                                            <span className="fw-bold text-primary fs-5">$ 40</span>
                                            <span className="fw-bold text-muted ms-2">$ 30</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-primary flex-grow-1">View Details</button>
                                    <button className="btn btn-info text-white flex-grow-1 d-flex justify-content-between align-items-center px-3">
                                        <span>MF250E</span>
                                        <i className="fas fa-copy"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Collapsed Item */}
                            <div className="border rounded p-3 d-flex justify-content-between align-items-center bg-light">
                                <div className="d-flex gap-3 align-items-center">
                                    <div className="bg-secondary bg-opacity-25 rounded d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                                        <i className="fas fa-download text-secondary"></i>
                                    </div>
                                    <div>
                                        <h6 className="mb-0 small fw-bold">Maximize Download for Mudralaya App</h6>
                                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>Weekly Task</small>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <span className="text-primary small">In progress..</span>
                                    <i className="fas fa-chevron-down text-muted"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Leaderboard Section (Placeholder) */}
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 text-success fw-bold">Leaderboard</h5>
                            <i className="fas fa-ellipsis-v text-muted"></i>
                        </div>
                        <div className="card-body text-center py-5">
                            <p className="text-muted">Coming Soon...</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Tasks List & Notifications */}
                <div className="col-lg-4">
                    {/* Tasks List */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 text-success fw-bold">Tasks</h5>
                            <i className="fas fa-ellipsis-v text-muted"></i>
                        </div>
                        <div className="card-body p-0">
                            {tasks.map((task) => (
                                <div key={task.id} className="p-3 border-bottom d-flex justify-content-between align-items-center">
                                    <div className="d-flex gap-3 align-items-center">
                                        <div className={`rounded-circle d-flex align-items-center justify-content-center text-white ${task.id % 2 === 0 ? 'bg-purple' : 'bg-primary'}`} style={{ width: 36, height: 36, backgroundColor: task.id === 2 ? '#6f42c1' : '' }}>
                                            <i className={`fas ${task.id === 2 ? 'fa-mobile-alt' : 'fa-user-friends'}`}></i>
                                        </div>
                                        <div>
                                            <h6 className="mb-0 small fw-bold text-truncate" style={{ maxWidth: '120px' }}>{task.title}</h6>
                                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>{task.type}</small>
                                        </div>
                                    </div>
                                    <span className="badge bg-info text-white px-3 py-2">₹ {task.reward}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 text-success fw-bold">Notifications</h5>
                            <i className="fas fa-ellipsis-v text-muted"></i>
                        </div>
                        <div className="card-body">
                            <div className="text-center py-4 text-muted small">
                                No new notifications
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default DashboardHome;
