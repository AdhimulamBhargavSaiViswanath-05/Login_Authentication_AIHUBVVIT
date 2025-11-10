import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import '../styles/pages.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const checkPasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1;
    if (password.match(/([0-9])/)) strength += 1;
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1;

    if (strength < 2) {
      setPasswordStrength('Weak');
    } else if (strength === 2) {
      setPasswordStrength('Medium');
    } else if (strength >= 3) {
      setPasswordStrength('Strong');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordStrength === 'Weak') {
      setError('Please use a stronger password (at least 8 characters with uppercase, lowercase, and numbers)');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.resetPassword(
        token,
        formData.password,
        formData.confirmPassword
      );
      setMessage(response.message || 'Password has been reset successfully!');
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Invalid or expired token.');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === 'Weak') return 'red';
    if (passwordStrength === 'Medium') return 'orange';
    if (passwordStrength === 'Strong') return 'green';
    return 'transparent';
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          {success ? (
            <div className="success-message reset-success-animation" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 1rem' }}>
                <circle cx="12" cy="12" r="10" fill="#d4edda" stroke="#28a745" strokeWidth="2"/>
                <path d="M8 12l2.5 2.5L16 9" stroke="#28a745" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3 style={{ color: '#28a745', margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>
                Password Reset Successful! ✅
              </h3>
              <p style={{ margin: '0 0 1rem 0', color: '#155724', fontWeight: 600 }}>
                Your password has been updated successfully.
              </p>
              <div style={{ 
                background: '#d4edda', 
                padding: '1rem', 
                borderRadius: '8px', 
                borderLeft: '4px solid #28a745',
                marginBottom: '1rem' 
              }}>
                <p style={{ margin: 0, color: '#155724', fontSize: '0.938rem' }}>
                  📧 <strong>Confirmation email sent!</strong><br/>
                  Check your inbox for password reset confirmation.
                </p>
              </div>
              <p style={{ margin: 0, color: '#6c757d', fontSize: '0.875rem' }}>
                Redirecting to login page in 3 seconds...
              </p>
            </div>
          ) : (
            <>
              <div className="auth-header">
                <h1 className="auth-title">Create new password</h1>
                <p className="auth-subtitle">Enter a strong password for your account.</p>
              </div>
              
              {message && !success && <div className="success-message">{message}</div>}
              {error && <div className="error-message">{error}</div>}
              
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="password">New password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    required
                    autoComplete="new-password"
                  />
                  {passwordStrength && (
                    <div 
                      className="password-strength" 
                      style={{ 
                        color: getStrengthColor(),
                        marginTop: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      Password strength: <strong>{passwordStrength}</strong>
                    </div>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    required
                    autoComplete="new-password"
                  />
                </div>
                
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Resetting...' : 'Reset password'}
                </button>
              </form>
              
              <div className="auth-footer">
                <p>Remember your password? <Link to="/login">Sign in</Link></p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
