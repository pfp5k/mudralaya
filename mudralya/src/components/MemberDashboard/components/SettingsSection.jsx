import React, { useEffect, useState } from 'react';
import '../MemberDashboard.css';
import { supabase } from '../../../supabaseClient';

const SettingsSection = () => {
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        paymentMethods: {}
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data: res, error } = await supabase.functions.invoke('user-profile');
                if (error) throw error;

                const names = (res.full_name || '').split(' ');
                setProfile({
                    firstName: names[0] || '',
                    lastName: names.slice(1).join(' ') || '',
                    email: res.email_id || '',
                    mobileNumber: res.mobile_number || '',
                    paymentMethods: {}
                });
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const fullName = `${profile.firstName} ${profile.lastName}`.trim();
            const { error } = await supabase.functions.invoke('user-profile', {
                method: 'PUT',
                body: { full_name: fullName }
            });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile: ' + error.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="settings-section">
            <h2 className="mb-4">Account Settings</h2>
            {message.text && (
                <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`} role="alert">
                    {message.text}
                    <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
                </div>
            )}
            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: '12px' }}>
                        <h4 className="mb-4">Profile Details</h4>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label text-muted small">First Name</label>
                                <input type="text" className="form-control" name="firstName" value={profile.firstName || ''} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-muted small">Last Name</label>
                                <input type="text" className="form-control" name="lastName" value={profile.lastName || ''} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-muted small">Mobile Number</label>
                                <input type="tel" className="form-control" value={profile.mobileNumber || ''} readOnly disabled />
                            </div>
                            <button type="submit" className="btn btn-primary px-4" disabled={saving}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: '12px' }}>
                        <h4 className="mb-4">Payment Settings</h4>
                        <p className="text-muted small">Add your bank account or UPI ID to receive cashback payments.</p>
                        <div className="alert alert-info small">
                            <i className="fas fa-info-circle me-2"></i> Payment integration coming soon.
                        </div>
                        <button className="btn btn-outline-primary w-100 mb-3" disabled><i className="fas fa-university me-2"></i> Add Bank Account</button>
                        <button className="btn btn-outline-primary w-100" disabled><i className="fas fa-qrcode me-2"></i> Add UPI ID</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsSection;
