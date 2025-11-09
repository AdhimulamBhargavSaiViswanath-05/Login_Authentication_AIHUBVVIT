const express = require('express');
const router = express.Router();

// @desc    Get current user
// @route   GET /api/user
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      profilePicture: req.user.profilePicture,
      isVerified: req.user.isVerified
    });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// @desc    Check authentication status
// @route   GET /api/auth/check
router.get('/auth/check', (req, res) => {
  res.json({ authenticated: req.isAuthenticated() });
});

module.exports = router;
