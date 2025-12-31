import React, { useEffect, useState } from 'react';
import '../MemberDashboard.css';
import { supabase } from '../../../supabaseClient';

const ReferralSection = () => {
    const [referralData, setReferralData] = useState({
        referralCode: '',
        referredUsers: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReferrals = async () => {
            try {
                const { data: res, error } = await supabase.functions.invoke('user-profile');
                if (error) throw error;

                setReferralData({
                    referralCode: res.referral_code || '',
                    referredUsers: res.referredUsers || []
                });
            } catch (error) {
                console.error("Failed to fetch referrals", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReferrals();
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`https://mudralya.com/join?ref=${referralData.referralCode}`);
        alert('Referral link copied!');
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="referral-section">
            <h2 className="mb-4">Refer & Earn</h2>
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #00a0dc 0%, #2c3e50 100%)', color: 'white' }}>
                <div className="row align-items-center">
                    <div className="col-md-8">
                        <h3>Invite Friends & Earn</h3>
                        <p className="mb-0 text-white-50">Earn 10% of your friends' earnings for life!</p>
                    </div>
                    <div className="col-md-4 text-md-end mt-3 mt-md-0">
                        <button className="btn btn-light rounded-pill px-4 fw-bold text-primary">How it works</button>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '12px' }}>
                <h4 className="mb-3">Your Referral Link</h4>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" value={`https://mudralya.com/join?ref=${referralData.referralCode}`} readOnly />
                    <button className="btn btn-primary" type="button" onClick={copyToClipboard}><i className="fas fa-copy me-2"></i>Copy</button>
                </div>

                <h5 className="mt-4 mb-3">Total Referrals: {referralData.referredUsers.length}</h5>

                {referralData.referredUsers.length > 0 && (
                    <div className="table-responsive mt-3">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Joined Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {referralData.referredUsers.map((user, idx) => (
                                    <tr key={idx}>
                                        <td>{user.firstName} {user.lastName}</td>
                                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td><span className="badge bg-success">Active</span></td>
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

export default ReferralSection;
