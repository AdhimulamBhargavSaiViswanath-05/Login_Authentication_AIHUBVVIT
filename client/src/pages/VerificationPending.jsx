import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './VerificationPending.css';

const VerificationPending = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || 'your email';

  return (
    <div className="verification-pending-container">
      <div className="verification-pending-card">
        <div className="icon-container">
          <div className="icon-circle">
            ✉️
          </div>
        </div>

        <h1>Email Verification Required</h1>
        
        <div className="message-box">
          <p className="main-message">
            Thank you for signing up with AIHUB-VVIT!
          </p>
          <p className="info-message">
            We've sent a verification email to <strong>{email}</strong>
          </p>
          <p className="instruction-message">
            Please check your inbox and click the verification link to complete your registration.
          </p>
        </div>

        <div className="tips-section">
          <h3>📬 Didn't receive the email?</h3>
          <ul>
            <li>Check your spam or junk folder</li>
            <li>Wait a few minutes - email delivery may take time</li>
            <li>Make sure {email} is correct</li>
            <li>The verification link expires in 24 hours</li>
          </ul>
        </div>

        <div className="action-buttons">
          <button 
            onClick={() => window.location.reload()} 
            className="btn-resend"
          >
            🔄 Check Verification Status
          </button>
          
          <button 
            onClick={() => navigate('/')} 
            className="btn-home"
          >
            🏠 Back to Home
          </button>
        </div>

        <div className="footer-info">
          <p>
            <strong>Need help?</strong> Contact us at{' '}
            <a href="mailto:aihub-vvit@vvit.net">aihub-vvit@vvit.net</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationPending;
