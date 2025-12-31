import React, { useEffect, useState } from 'react';
import '../MemberDashboard.css';
import { supabase } from '../../../supabaseClient';

const EarningsOverview = () => {
    const [stats, setStats] = useState({
        earnings: 0,
        pending: 0,
        tasksCompleted: 0,
        referrals: 0,
        paid: 0
    });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: res, error } = await supabase.functions.invoke('dashboard-api', {
                    body: { action: 'get-dashboard-summary' } // Reusing this to get stats
                });

                if (error) throw error;

                if (res.stats) {
                    setStats({
                        earnings: res.stats.approved || 0,
                        pending: res.stats.pending || 0,
                        tasksCompleted: 0,
                        referrals: 0,
                        paid: res.stats.payout || 0
                    });
                }

                if (res.transactions) {
                    setTransactions(res.transactions);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="earnings-overview">
            <h2 className="mb-4">My Earnings</h2>
            <div className="stats-grid">
                <div className="stat-card earnings">
                    <div className="stat-icon"><i className="fas fa-wallet"></i></div>
                    <div className="stat-info">
                        <h3>Total Earnings</h3>
                        <p className="stat-value">₹ {stats.earnings.toFixed(2)}</p>
                    </div>
                </div>
                <div className="stat-card tasks">
                    <div className="stat-icon"><i className="fas fa-clock"></i></div>
                    <div className="stat-info">
                        <h3>Pending</h3>
                        <p className="stat-value">₹ {stats.pending.toFixed(2)}</p>
                    </div>
                </div>
                <div className="stat-card referrals">
                    <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
                    <div className="stat-info">
                        <h3>Paid</h3>
                        <p className="stat-value">₹ {stats.paid.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <div className="card mt-4 p-4 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                <h4 className="mb-3">Transaction History</h4>

                {transactions.length === 0 ? (
                    <div className="text-center text-muted py-5">
                        <i className="fas fa-history fa-3x mb-3 text-light-gray"></i>
                        <p>No transactions yet</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th className="text-end">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(tx => (
                                    <tr key={tx.id}>
                                        <td>{new Date(tx.created_at).toLocaleDateString()}</td>
                                        <td>{tx.title || tx.description || 'Transaction'}</td>
                                        <td>
                                            <span className={`badge bg-${tx.status === 'completed' || tx.status === 'Confirmed' || tx.status === 'Success' ? 'success' : 'warning'}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className={`text-end fw-bold ${tx.amount > 0 ? 'text-success' : 'text-danger'}`}>
                                            {tx.amount > 0 ? '+' : ''} ₹ {Math.abs(tx.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EarningsOverview;
