import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VerificationSuccess.css';

const VerificationSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect to login after 5 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 20000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="verification-container">
      <div className="verification-card">
        <div className="success-icon">
          <svg viewBox="0 0 52 52" className="checkmark">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>
        
        <h1 className="success-title">Email Successfully Verified! 🎉</h1>
        
        <div className="success-message">
          <p className="main-message">
            Congratulations! Your email has been verified successfully.
          </p>
          <p className="sub-message">
            Your AIHub account is now fully activated and ready to use.
          </p>
        </div>

        <div className="info-box">
          <div className="info-item">
            <span className="info-icon">✅</span>
            <span>Account Status: <strong className="status-verified">Verified</strong></span>
          </div>
          <div className="info-item">
            <span className="info-icon">📧</span>
            <span>Welcome email sent to your inbox</span>
          </div>
          <div className="info-item">
            <span className="info-icon">🚀</span>
            <span>Ready to explore AIHub</span>
          </div>
        </div>

        <div className="next-steps">
          <h3>What's Next?</h3>
          <ul>
            <li>🔐 Log in to your account</li>
            <li>📊 Complete your profile</li>
            <li>🎯 Explore AI projects and workshops</li>
            <li>🤝 Connect with the AIHub community</li>
          </ul>
        </div>

        <div className="action-buttons">
          <button 
            className="btn-primary"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>

        <p className="redirect-message">
          You will be automatically redirected to login in 5 seconds...
        </p>

        <div className="branding">
          <p className="brand-name">AIHub - VVIT</p>
          <p className="brand-tagline">Vasireddy Venkatadri Institute of Technology</p>
          <p className="brand-motto">Empowering Innovation Through Artificial Intelligence</p>
        </div>
      </div>
    </div>
  );
};

export default VerificationSuccess;
