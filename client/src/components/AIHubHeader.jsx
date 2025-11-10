import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AIHubHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="aihub-navbar">
        <div className="aihub-nav-container">
          <div className="aihub-nav-brand">
            <img 
              src="https://aihub-vvit.github.io/images/AI-HUB.jpg" 
              alt="AI-HUB@VVIT" 
              className="aihub-logo"
            />
            <a href="https://aihub-vvit.github.io/" className="aihub-brand-text">
              AI-HUB@VVIT
            </a>
          </div>

          <button 
            className={`aihub-nav-toggler ${isNavOpen ? 'active' : ''}`}
            onClick={toggleNav}
            aria-label="Toggle navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`aihub-nav-menu ${isNavOpen ? 'active' : ''}`}>
            <ul className="aihub-nav-links">
              <li className="aihub-nav-item">
                <a href="https://aihub-vvit.github.io/index.html" className="aihub-nav-link">
                  Home
                </a>
              </li>

              <li className="aihub-nav-item aihub-dropdown">
                <button 
                  className="aihub-nav-link aihub-dropdown-toggle"
                  onClick={() => toggleDropdown('projects')}
                >
                  Projects
                  <i className="fas fa-chevron-down"></i>
                </button>
                {openDropdowns.projects && (
                  <ul className="aihub-dropdown-menu">
                    <li>
                      <a href="https://aihub-vvit.github.io/Projects.html" className="aihub-dropdown-item">
                        Ongoing Projects
                      </a>
                    </li>
                    <li className="aihub-dropdown-submenu">
                      <button 
                        className="aihub-dropdown-item aihub-dropdown-toggle"
                        onClick={() => toggleDropdown('completed')}
                      >
                        Completed Projects
                        <i className="fas fa-chevron-right"></i>
                      </button>
                      {openDropdowns.completed && (
                        <ul className="aihub-submenu">
                          <li>
                            <a href="https://aihub-vvit.github.io/Game.html" className="aihub-dropdown-item">
                              Games
                            </a>
                          </li>
                          <li>
                            <a href="https://aihub-vvit.github.io/Projects.html#ml" className="aihub-dropdown-item">
                              Machine Learning
                            </a>
                          </li>
                          <li>
                            <a href="https://aihub-vvit.github.io/Projects.html#dl" className="aihub-dropdown-item">
                              Deep Learning
                            </a>
                          </li>
                        </ul>
                      )}
                    </li>
                  </ul>
                )}
              </li>

              <li className="aihub-nav-item">
                <a href="https://aihub-vvit.github.io/blog.html" className="aihub-nav-link">
                  Blogs
                </a>
              </li>

              <li className="aihub-nav-item">
                <a href="https://aihub-vvit.github.io/Events.html" className="aihub-nav-link">
                  Events
                </a>
              </li>

              <li className="aihub-nav-item">
                <a href="https://aihub-vvit.github.io/Apps.html" className="aihub-nav-link">
                  Apps
                </a>
              </li>

              <li className="aihub-nav-item aihub-dropdown">
                <button 
                  className="aihub-nav-link aihub-dropdown-toggle"
                  onClick={() => toggleDropdown('career')}
                >
                  Career Catalysts
                  <i className="fas fa-chevron-down"></i>
                </button>
                {openDropdowns.career && (
                  <ul className="aihub-dropdown-menu">
                    <li>
                      <a href="https://aihub-vvit.github.io/Career.html" className="aihub-dropdown-item">
                        Job Guide
                      </a>
                    </li>
                    <li className="aihub-dropdown-submenu">
                      <button 
                        className="aihub-dropdown-item aihub-dropdown-toggle"
                        onClick={() => toggleDropdown('lifeskills')}
                      >
                        Life Skills
                        <i className="fas fa-chevron-right"></i>
                      </button>
                      {openDropdowns.lifeskills && (
                        <ul className="aihub-submenu">
                          <li>
                            <a href="#" className="aihub-dropdown-item">
                              Quantitative Aptitude
                            </a>
                          </li>
                          <li>
                            <a href="#" className="aihub-dropdown-item">
                              Reasoning Ability
                            </a>
                          </li>
                          <li>
                            <a href="#" className="aihub-dropdown-item">
                              Verbal Ability
                            </a>
                          </li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <a href="https://aihub-vvit.github.io/Career.html" className="aihub-dropdown-item">
                        DSA
                      </a>
                    </li>
                    <li>
                      <a href="https://aihub-vvit.github.io/Career.html" className="aihub-dropdown-item">
                        Web Dev
                      </a>
                    </li>
                  </ul>
                )}
              </li>

              <li className="aihub-nav-item">
                <a href="https://aihub-vvit.github.io/News.html" className="aihub-nav-link">
                  News
                </a>
              </li>

              <li className="aihub-nav-item">
                <a href="https://aihub-vvit.github.io/About.html" className="aihub-nav-link">
                  People
                </a>
              </li>
            </ul>

            {/* Auth Buttons - Right Side */}
            <div className="aihub-auth-buttons">
              {user ? (
                <>
                  <Link to="/" className="aihub-btn aihub-btn-dashboard">
                    <i className="fas fa-home"></i>
                    <span>Dashboard</span>
                  </Link>
                  <button onClick={handleLogout} className="aihub-btn aihub-btn-logout">
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="aihub-btn aihub-btn-login">
                    <i className="fas fa-sign-in-alt"></i>
                    <span>Login</span>
                  </Link>
                  <Link to="/signup" className="aihub-btn aihub-btn-signup">
                    <i className="fas fa-user-plus"></i>
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <style jsx>{`
        /* AI-HUB Header Styles */
        .aihub-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          padding: 0;
        }

        .aihub-nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0.75rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .aihub-nav-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .aihub-logo {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .aihub-brand-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: #667eea;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .aihub-brand-text:hover {
          color: #764ba2;
        }

        .aihub-nav-toggler {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }

        .aihub-nav-toggler span {
          width: 25px;
          height: 3px;
          background: #667eea;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .aihub-nav-toggler.active span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .aihub-nav-toggler.active span:nth-child(2) {
          opacity: 0;
        }

        .aihub-nav-toggler.active span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -6px);
        }

        .aihub-nav-menu {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .aihub-nav-links {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 0.5rem;
          align-items: center;
        }

        .aihub-nav-item {
          position: relative;
        }

        .aihub-nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          color: #4a5568;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.938rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          background: none;
          border: none;
          cursor: pointer;
          white-space: nowrap;
        }

        .aihub-nav-link:hover {
          color: #667eea;
          background: rgba(102, 126, 234, 0.1);
        }

        .aihub-dropdown-toggle i {
          font-size: 0.75rem;
          transition: transform 0.3s ease;
        }

        .aihub-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          min-width: 200px;
          padding: 0.5rem 0;
          list-style: none;
          margin-top: 0.5rem;
          z-index: 1001;
        }

        .aihub-dropdown-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.25rem;
          color: #4a5568;
          text-decoration: none;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }

        .aihub-dropdown-item:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .aihub-dropdown-submenu {
          position: relative;
        }

        .aihub-submenu {
          position: absolute;
          top: 0;
          left: 100%;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          min-width: 180px;
          padding: 0.5rem 0;
          list-style: none;
          margin-left: 0.5rem;
        }

        .aihub-auth-buttons {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          margin-left: auto;
        }

        .aihub-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
          white-space: nowrap;
        }

        .aihub-btn i {
          font-size: 1rem;
        }

        .aihub-btn-login {
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
        }

        .aihub-btn-login:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .aihub-btn-signup {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: 2px solid transparent;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .aihub-btn-signup:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
        }

        .aihub-btn-dashboard {
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
        }

        .aihub-btn-dashboard:hover {
          background: rgba(102, 126, 234, 0.1);
          transform: translateY(-2px);
        }

        .aihub-btn-logout {
          background: #FF6347;
          color: white;
          border: 2px solid transparent;
        }

        .aihub-btn-logout:hover {
          background: #f64f32;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 99, 71, 0.3);
        }

        /* Mobile Responsive */
        @media (max-width: 992px) {
          .aihub-nav-toggler {
            display: flex;
          }

          .aihub-nav-menu {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            align-items: stretch;
            padding: 1rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
          }

          .aihub-nav-menu.active {
            max-height: calc(100vh - 70px);
            overflow-y: auto;
          }

          .aihub-nav-links {
            flex-direction: column;
            width: 100%;
            gap: 0;
          }

          .aihub-nav-item {
            width: 100%;
          }

          .aihub-nav-link {
            width: 100%;
            justify-content: space-between;
          }

          .aihub-dropdown-menu,
          .aihub-submenu {
            position: static;
            box-shadow: none;
            margin: 0;
            padding-left: 1rem;
          }

          .aihub-auth-buttons {
            width: 100%;
            flex-direction: column;
            margin-left: 0;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #e2e8f0;
          }

          .aihub-btn {
            width: 100%;
            justify-content: center;
          }
        }

        /* Add spacing for fixed header */
        body {
          padding-top: 70px;
        }
      `}</style>
    </>
  );
};

export default AIHubHeader;
