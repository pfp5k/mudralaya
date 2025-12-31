import React, { useEffect, useState } from 'react';
import { MdPlayArrow, MdTrendingUp, MdAccountBalanceWallet, MdGroup, MdContentCopy, MdRocketLaunch, MdOutlineFeedback } from 'react-icons/md';
import { FaHandHoldingUsd } from 'react-icons/fa';
import { useUser } from '../context/UserContext';
import { supabase } from '../supabaseClient';
import './DashboardHome.css';

const DashboardHome = () => {
    const { profile, user } = useUser();
    const [data, setData] = useState({ tasks: [], stats: { approved: 0, pending: 0, total: 60000 }, transactions: [] });
    const [loading, setLoading] = useState(true);

    const fullName = profile?.full_name || 'User';

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return; // Wait for user to be available

            try {
                // Parallel fetching for performance
                const [tasksRes, transactionsRes, statsRes] = await Promise.all([
                    supabase.from('tasks').select('*').limit(5),
                    supabase
                        .from('transactions')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false })
                        .limit(5),
                    supabase.rpc('get_user_wallet_stats', { user_id_param: user.id })
                ]);

                const tasks = tasksRes.data || [];
                const transactions = transactionsRes.data || [];
                // Handle RPC returning null or error gracefully
                const stats = statsRes.data || { approved: 0, pending: 0, total: 0, payout: 0, today: 0, monthly: 0 };

                setData({
                    tasks,
                    transactions,
                    stats
                });

                if (tasksRes.error) console.error("Tasks fetch error:", tasksRes.error);
                if (transactionsRes.error) console.error("Transactions fetch error:", transactionsRes.error);
                if (statsRes.error) console.error("Stats RPC error:", statsRes.error);

            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]); // Re-run when user is available

    const getIcon = (type) => {
        switch (type) {
            case 'group': return <MdGroup />;
            case 'rocket': return <MdRocketLaunch />;
            case 'feedback': return <MdOutlineFeedback />;
            default: return <MdContentCopy />;
        }
    };

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
                        <div className="stat-value">₹ {data.stats?.today || 0}</div>
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
                        <div className="stat-value">₹ {data.stats?.monthly || 20000}</div>
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
                        <div className="stat-value">₹ {data.stats?.total || 60000}</div>
                        <div className="stat-icon-bg icon-wallet">
                            <MdAccountBalanceWallet />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Grid: Ongoing Task & Tasks List */}
            <div className="dashboard-grid">
                <div className="dashboard-column">
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3>Ongoing Task</h3>
                            <span>:</span>
                        </div>
                        {data.tasks && data.tasks[0] ? (
                            <div className="ongoing-task-card">
                                <div className="task-info-row">
                                    <div className="task-icon-circle blue-gradient">
                                        {getIcon(data.tasks[0].icon_type)}
                                    </div>
                                    <div className="task-details">
                                        <h4>{data.tasks[0].title}</h4>
                                        <p>{data.tasks[0].category}</p>
                                    </div>
                                    <span className="expand-icon">^</span>
                                </div>
                                <div className="task-rewards-row">
                                    <span>Task Reward</span>
                                    <div className="rewards">
                                        <div className="reward-item member">
                                            <span className="badge-label member">Members</span>
                                            <span className="amount">₹ {data.tasks[0].reward_member}</span>
                                        </div>
                                        <div className="reward-item free">
                                            <span className="badge-label free">Free</span>
                                            <span className="amount">₹ {data.tasks[0].reward_free}</span>
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
                        ) : (
                            <div className="empty-state"><p>No ongoing tasks</p></div>
                        )}
                    </div>

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

                <div className="dashboard-column">
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3>Tasks</h3>
                            <span>:</span>
                        </div>
                        <div className="tasks-list">
                            {data.tasks?.map((task, index) => (
                                <div key={task.id} className="task-list-item">
                                    <div className="task-item-left">
                                        <div className={`task-icon-circle ${index % 2 === 0 ? 'blue-gradient' : 'purple-gradient'}`}>
                                            {getIcon(task.icon_type)}
                                        </div>
                                        <div className="task-details">
                                            <h4>{task.title}</h4>
                                            <p>{task.category}</p>
                                        </div>
                                    </div>
                                    <button className="btn-price">
                                        ₹ {task.reward_free}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="dashboard-card full-height">
                        <div className="card-header">
                            <h3>Notifications</h3>
                            <span>:</span>
                        </div>
                        <div className="empty-state">
                            <p>No new notifications</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;

