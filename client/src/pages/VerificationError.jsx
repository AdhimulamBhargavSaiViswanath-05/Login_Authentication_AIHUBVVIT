import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './VerificationError.css';

const VerificationError = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get('message') || 'Invalid or expired verification token';

  return (
    <div className="error-container">
      <div className="error-card">
        <div className="error-icon">
          <svg viewBox="0 0 52 52" className="error-mark">
            <circle className="error-circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="error-x" fill="none" d="M16 16 36 36 M36 16 16 36"/>
          </svg>
        </div>
        
        <h1 className="error-title">Email Verification Failed</h1>
        
        <div className="error-message">
          <p className="main-message">
            We couldn't verify your email address.
          </p>
          <p className="error-reason">
            <strong>Reason:</strong> {errorMessage}
          </p>
        </div>

        <div className="info-box error-info">
          <h3>⚠️ Common Issues</h3>
          <ul>
            <li><strong>Expired Link:</strong> Verification links expire after 24 hours</li>
            <li><strong>Already Verified:</strong> Your email might be already verified</li>
            <li><strong>Invalid Token:</strong> The link might be incomplete or corrupted</li>
            <li><strong>Network Issues:</strong> Connection problems during verification</li>
          </ul>
        </div>

        <div className="solutions">
          <h3>🔧 What You Can Do</h3>
          <div className="solution-options">
            <div className="solution-card">
              <div className="solution-icon">📧</div>
              <h4>Request New Link</h4>
              <p>Get a new verification email sent to your inbox</p>
              <button 
                className="btn-solution"
                onClick={() => navigate('/forgot-password')}
              >
                Resend Email
              </button>
            </div>
            <div className="solution-card">
              <div className="solution-icon">🔐</div>
              <h4>Try Login</h4>
              <p>If already verified, try logging in directly</p>
              <button 
                className="btn-solution"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </button>
            </div>
            <div className="solution-card">
              <div className="solution-icon">📝</div>
              <h4>Create New Account</h4>
              <p>Start fresh with a new registration</p>
              <button 
                className="btn-solution"
                onClick={() => navigate('/signup')}
              >
                Sign Up Again
              </button>
            </div>
          </div>
        </div>

        <div className="help-section">
          <h3>Need Help?</h3>
          <p>If you continue to experience issues, please contact our support team.</p>
          <div className="contact-links">
            <a href="mailto:aihub.vvit@gmail.com" className="contact-link">
              ✉️ Email Support
            </a>
            <a href="https://aihub-vvitu.social" className="contact-link" target="_blank" rel="noopener noreferrer">
              🌐 Visit Website
            </a>
          </div>
        </div>

        <button 
          className="btn-home"
          onClick={() => navigate('/')}
        >
          ← Back to Home
        </button>

        <div className="branding">
          <p className="brand-name">AIHub - VVIT</p>
          <p className="brand-tagline">Vasireddy Venkatadri Institute of Technology</p>
        </div>
      </div>
    </div>
  );
};

export default VerificationError;
