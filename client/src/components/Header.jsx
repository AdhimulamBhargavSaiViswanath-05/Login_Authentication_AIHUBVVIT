import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/components.css';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header>
      <h1><Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>AIHub</Link></h1>
      <nav>
        {user ? (
          <a href="/auth/logout" onClick={handleLogout}>Logout</a>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
            <a href="http://localhost:3000/auth/google" className="google-btn">Login with Google</a>
            <a href="http://localhost:3000/auth/microsoft" className="microsoft-btn">Login with Microsoft</a>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
