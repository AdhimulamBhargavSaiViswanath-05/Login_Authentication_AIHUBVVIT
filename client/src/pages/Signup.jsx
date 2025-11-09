import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import '../styles/pages.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [passwordStrength, setPasswordStrength] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    // Comprehensive email validation regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    
    // Additional checks for common invalid patterns
    if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
      return 'Email address format is invalid';
    }
    
    // Check for valid email domain
    const domain = email.split('@')[1];
    if (!domain) {
      return 'Invalid email address';
    }
    
    // Block obviously fake domains
    const fakeDomains = ['test.com', 'example.com', 'fake.com', 'temp.com', 'throwaway.com'];
    if (fakeDomains.includes(domain.toLowerCase())) {
      return 'Please use a real email address';
    }
    
    // Check for common typos in popular domains
    const domainLower = domain.toLowerCase();
    const typoSuggestions = {
      'gamil.com': 'gmail.com',
      'gmial.com': 'gmail.com',
      'gmai.com': 'gmail.com',
      'yahooo.com': 'yahoo.com',
      'yaho.com': 'yahoo.com',
      'hotmial.com': 'hotmail.com',
      'outlok.com': 'outlook.com'
    };
    
    if (typoSuggestions[domainLower]) {
      return `Did you mean ${email.split('@')[0]}@${typoSuggestions[domainLower]}?`;
    }
    
    return null;
  };

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
    
    // Clear messages when user types
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate email format before submission
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setError(emailError);
      return;
    }
    
    // Check password strength
    if (passwordStrength === 'Weak') {
      setError('Please use a stronger password (at least 8 characters with uppercase, lowercase, and numbers)');
      return;
    }
    
    setLoading(true);

    try {
      const response = await authService.signup(formData.name, formData.email, formData.password);
      
      // Show success message and redirect to login
      setSuccess(response.message || 'Account created! Please check your email to verify your account.');
      setFormData({ name: '', email: '', password: '' });
      setPasswordStrength('');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
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
          <div className="auth-header">
            <h1 className="auth-title">Create an account</h1>
            <p className="auth-subtitle">Get started with your free account.</p>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {/* OAuth Buttons */}
          <div className="oauth-buttons">
            <a href="http://localhost:3000/auth/google" className="oauth-btn google-oauth">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </a>

            <a href="http://localhost:3000/auth/microsoft" className="oauth-btn microsoft-oauth">
              <svg viewBox="0 0 23 23" width="20" height="20">
                <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                <path fill="#f35325" d="M1 1h10v10H1z"/>
                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                <path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
              <span>Continue with Microsoft</span>
            </a>
          </div>

          <div className="divider">
            <span>or sign up with email</span>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                disabled={loading || success}
                autoComplete="name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={loading || success}
                autoComplete="email"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                disabled={loading || success}
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

            <button type="submit" className="btn-primary" disabled={loading || success}>
              {loading ? 'Creating account...' : success ? 'Redirecting...' : 'Sign up'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
