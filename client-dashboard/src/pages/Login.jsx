import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { FaPhoneAlt, FaLock, FaArrowRight, FaSpinner } from 'react-icons/fa';
import './Login.css';

const Login = () => {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('phone'); // 'phone' or 'otp'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        let formattedPhone = phone.trim();
        // Default to India (+91) if no country code provided
        if (!formattedPhone.startsWith('+')) {
            formattedPhone = '+91' + formattedPhone;
        }

        try {
            const { error } = await supabase.auth.signInWithOtp({
                phone: formattedPhone,
            });
            if (error) throw error;
            setPhone(formattedPhone); // Update state to correct format for verification
            setStep('otp');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.verifyOtp({
                phone: phone,
                token: otp,
                type: 'sms',
            });
            if (error) throw error;
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <div className="login-header">
                    <img src="/mudralaya_logo.webp" alt="Mudralaya Logo" className="logo" />
                    <h1>Welcome Back</h1>
                    <p>Secure Client Access</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className={`login-form-container ${step === 'otp' ? 'slide-left' : ''}`}>
                    {step === 'phone' ? (
                        <form onSubmit={handleSendOtp} className="login-form">
                            <div className="input-group">
                                <span className="phone-prefix">+91</span>
                                <input
                                    type="tel"
                                    placeholder="Enter 10-digit number"
                                    value={phone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        setPhone(val);
                                    }}
                                    required
                                />
                            </div>
                            <button type="submit" disabled={loading || phone.length !== 10} className="btn-primary">
                                {loading ? <FaSpinner className="spinner" /> : <>Send OTP <FaArrowRight /></>}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="login-form">
                            <div className="input-group">
                                <FaLock className="input-icon" />
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary">
                                {loading ? <FaSpinner className="spinner" /> : 'Verify & Login'}
                            </button>
                            <button
                                type="button"
                                className="btn-text"
                                onClick={() => setStep('phone')}
                                disabled={loading}
                            >
                                Change Phone Number
                            </button>
                        </form>
                    )}
                </div>

                <div className="login-footer">
                    <p>&copy; {new Date().getFullYear()} Mudralaya Fintech. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
