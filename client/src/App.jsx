import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import VerificationSuccess from './pages/VerificationSuccess';
import VerificationError from './pages/VerificationError';
import VerificationPending from './pages/VerificationPending';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/auth/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/verification-success" element={<VerificationSuccess />} />
          <Route path="/verification-error" element={<VerificationError />} />
          <Route path="/verification-pending" element={<VerificationPending />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
