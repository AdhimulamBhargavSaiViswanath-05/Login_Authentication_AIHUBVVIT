import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/pages.css';

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await authService.verifyEmail(token);
      setMessage(response.message || 'Email successfully verified!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify email. Invalid or expired token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Header />
      <main>
        <div className="form-container verify-container">
          <h2>Email Verification</h2>
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Verifying your email address...</p>
            </div>
          )}
          {message && (
            <div className="verify-success">
              <div className="icon-large success-icon">✓</div>
              <div className="success-message">{message}</div>
              <p className="verify-text">Your email has been successfully verified. You can now access all features.</p>
              <Link to="/login" className="btn-primary">Go to Login</Link>
            </div>
          )}
          {error && (
            <div className="verify-error">
              <div className="icon-large error-icon">✗</div>
              <div className="error-message">{error}</div>
              <p className="verify-text">The verification link may have expired or is invalid.</p>
              <div className="button-group">
                <Link to="/signup" className="btn-primary">Sign Up Again</Link>
                <Link to="/login" className="btn-secondary">Go to Login</Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VerifyEmail;
