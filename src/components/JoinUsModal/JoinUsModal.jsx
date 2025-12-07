import React, { useState } from 'react';
import './JoinUsModal.css';

const JoinUsModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        mobileNumber: '',
        emailId: '',
        dateOfBirth: '',
        profession: '',
        hasIRDAILicense: '',
        plan: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Join Us Form Data:', formData);
        alert('Thank you for your interest! We will contact you soon.');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="join-us-modal" onClick={(e) => e.stopPropagation()}>
                {/* Left Side - Illustration */}
                <div className="modal-left">

                    <div className="modal-illustration">
                        <img
                            src="/images/join-us-illustration.png"
                            alt="Join Us"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/300x300?text=Join+Us';
                            }}
                        />
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="modal-right">
                    <button className="modal-close" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>

                    <h2 className="modal-title">Become our Advisor</h2>
                    <p className="modal-subtitle">
                        It will take a couple of minutes,<br />
                        to fill this form so that we can assist you accordingly!
                    </p>

                    <div className="form-section-title">Your personal data</div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name*</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="mobileNumber">Mobile Number*</label>
                            <input
                                type="tel"
                                id="mobileNumber"
                                name="mobileNumber"
                                placeholder="Enter your mobile number"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="emailId">Email Id</label>
                            <input
                                type="email"
                                id="emailId"
                                name="emailId"
                                placeholder="Enter your email"
                                value={formData.emailId}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="dateOfBirth">Date of birth*</label>
                            <input
                                type="date"
                                id="dateOfBirth"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="profession">Profession*</label>
                            <select
                                id="profession"
                                name="profession"
                                value={formData.profession}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select profession</option>
                                <option value="student">Student</option>
                                <option value="working-professional">Working Professional</option>
                                <option value="house-wife">House Wife</option>
                                <option value="business-man">Business Man</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="hasIRDAILicense">Do you have IRDAI License*</label>
                            <select
                                id="hasIRDAILicense"
                                name="hasIRDAILicense"
                                value={formData.hasIRDAILicense}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="plan">Plan*</label>
                            <select
                                id="plan"
                                name="plan"
                                value={formData.plan}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select plan</option>
                                <option value="individual">Individual</option>
                                <option value="team">Team</option>
                                <option value="enterprise">Enterprise</option>
                            </select>
                        </div>

                        <button type="submit" className="btn-proceed">
                            Submit Form
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JoinUsModal;
