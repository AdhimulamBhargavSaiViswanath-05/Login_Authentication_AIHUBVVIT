import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/pages.css';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="dashboard-page">
      {user ? (
        <div className="dashboard-container">
          {/* Main Content */}
          <main className="dashboard-main">
            <div className="welcome-text-dash">
              <h5>Welcome</h5>
            </div>

            <div className="user-profile-card">
              {/* Logout Button */}
              <button onClick={handleLogout} className="logout-button-card">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Sign Out
              </button>
              {/* Status Badge */}
              <div className="status-badge">
                <div className="status-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#4CAF50" opacity="0.2"/>
                    <path d="M9 12l2 2 4-4" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="status-text">Authenticated</span>
              </div>

              {/* User Avatar */}
              <div className="user-avatar-section">
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user.name}
                    className="user-avatar"
                  />
                ) : (
                  <div className="user-avatar-placeholder">
                    <span>{user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </div>

              {/* User Information */}
              <div className="user-info-section">
                <h1 className="user-name">{user.name}</h1>
                <p className="user-email">{user.email}</p>
                
                {user.isVerified ? (
                  <div className="verification-badge verified">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                    <span>Email Verified</span>
                  </div>
                ) : (
                  <div className="verification-badge unverified">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <span>Email Not Verified</span>
                  </div>
                )}
              </div>

              {/* Account Details */}
              <div className="account-details">
                <div className="detail-item">
                  <div className="detail-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Account Type</span>
                    <span className="detail-value">Standard User</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Member Since</span>
                    <span className="detail-value">{new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              <div className="quote-section">
                <p><b>"</b> We are the student community of VVIT dedicated to leveraging AI <b>"</b></p>
              </div>
            </div>
          </main>
        </div>
      ) : (
        <div className="welcome-container-guest">
          <div className="welcome-card-guest">
            <div className="logo-section-center">
              <img 
                src="https://aihub-vvit.github.io/images/AI-HUB.jpg" 
                alt="AI-HUB Logo" 
                className="logo-image-large"
              />
            </div>
            <div className="welcome-text-center">
              <h5>Welcome all</h5>
            </div>
            <h1 className="welcome-title">AI-HUB @ VVIT</h1>
            <p className="welcome-message">
              Please sign in to access your account
            </p>
            <div className="auth-actions">
              <button onClick={() => navigate('/login')} className="btn-primary">
                Sign in
              </button>
              <button onClick={() => navigate('/signup')} className="btn-secondary">
                Create account
              </button>
            </div>
            <div className="quote-section-guest">
              <p><b>"</b> We are the student community of VVIT dedicated to leveraging AI <b>"</b></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
