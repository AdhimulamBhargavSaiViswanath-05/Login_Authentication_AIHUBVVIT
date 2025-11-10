const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../services/emailService');
const User = require('../models/User');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists FIRST (before any operations)
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log(`❌ Signup failed: User with email ${email} already exists`);
      return res.status(400).json({ 
        message: 'User already exists with this email address. Please login instead.' 
      });
    }

    // Create user - password will be automatically hashed by the pre-save hook in User model
    const user = new User({
      name,
      email: email.toLowerCase(),
      password, // Don't hash here - the model's pre-save hook will hash it
      isVerified: false
    });

    // Save user to database first
    await user.save();
    console.log(`✅ New user created: ${user.email} (ID: ${user._id})`);

    // Only send verification email AFTER successful user creation
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const url = `http://localhost:5173/auth/verify-email/${token}`;

    await sendEmail({
      to: user.email,
      subject: '🎓 Welcome to AIHUB-VVIT! Verify Your Email',
      text: `Hello ${user.name}!\n\nWelcome to AIHUB-VVIT! Please verify your email by clicking this link:\n${url}\n\nThis link will expire in 24 hours.\n\n© ${new Date().getFullYear()} AIHUB-VVIT`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f4f7fa;
            }
            .email-container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: bold;
            }
            .header p {
              margin: 10px 0 0 0;
              font-size: 16px;
              opacity: 0.9;
            }
            .content {
              padding: 40px 30px;
            }
            .welcome-message {
              font-size: 18px;
              color: #333;
              margin-bottom: 20px;
            }
            .verify-button {
              display: inline-block;
              padding: 15px 40px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white !important;
              text-decoration: none;
              border-radius: 50px;
              font-weight: bold;
              font-size: 16px;
              margin: 20px 0;
              box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
              transition: all 0.3s ease;
            }
            .verify-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
            }
            .quote-section {
              background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
              padding: 20px;
              border-radius: 8px;
              margin: 30px 0;
              border-left: 4px solid #667eea;
            }
            .quote-section p {
              margin: 0;
              font-style: italic;
              color: #555;
              font-size: 16px;
            }
            .quote-section .quote-author {
              margin-top: 10px;
              font-weight: bold;
              color: #5b21b6;
              font-style: normal;
            }
            .info-section {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .college-info {
              display: flex;
              align-items: center;
              margin-bottom: 20px;
              padding: 15px;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .college-logo {
              width: 80px;
              height: 80px;
              margin-right: 20px;
              border-radius: 8px;
            }
            .college-details h3 {
              margin: 0 0 5px 0;
              color: #333;
              font-size: 18px;
            }
            .college-details a {
              color: #5b21b6;
              text-decoration: none;
              font-size: 14px;
            }
            .college-details a:hover {
              text-decoration: underline;
            }
            .contact-section {
              margin-top: 30px;
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 8px;
              color: white;
            }
            .contact-section h3 {
              margin: 0 0 15px 0;
              font-size: 20px;
            }
            .contact-item {
              margin: 10px 0;
              display: flex;
              align-items: center;
            }
            .contact-item a {
              color: white;
              text-decoration: none;
              margin-left: 10px;
            }
            .contact-item a:hover {
              text-decoration: underline;
            }
            .social-links {
              display: flex;
              gap: 15px;
              margin-top: 15px;
            }
            .social-links a {
              display: inline-block;
              padding: 10px 20px;
              background: rgba(255, 255, 255, 0.2);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-size: 14px;
              transition: all 0.3s ease;
            }
            .social-links a:hover {
              background: rgba(255, 255, 255, 0.3);
            }
            .footer {
              background-color: #2c3e50;
              color: white;
              text-align: center;
              padding: 20px;
              font-size: 14px;
            }
            .footer p {
              margin: 5px 0;
            }
            .warning {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
              color: #856404;
            }
            .expiry-notice {
              font-size: 14px;
              color: #666;
              margin-top: 20px;
              padding: 10px;
              background-color: #f8f9fa;
              border-radius: 5px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <!-- Header -->
            <div class="header">
              <h1>🚀 Welcome to AIHUB-VVIT!</h1>
              <p>AI Student Community at VVIT</p>
            </div>

            <!-- Main Content -->
            <div class="content">
              <div class="welcome-message">
                <h2>Hello ${user.name}! 👋</h2>
                <p>Thank you for joining <strong>AIHUB-VVIT</strong>, the student community of Vasireddy Venkatadri Institute of Technology dedicated to leveraging Artificial Intelligence.</p>
              </div>

              <p>To complete your registration and start exploring our AI community, please verify your email address by clicking the button below:</p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${url}" class="verify-button">✓ Click Here to Verify Email</a>
              </div>

              <!-- Quote Section -->
              <div class="quote-section">
                <p>"Inspiration is not tangible unless you make it real."</p>
                <p class="quote-author">— AIHUB-VVIT Community</p>
              </div>

              <!-- About AIHUB -->
              <div class="info-section">
                <h3 style="color: #5b21b6; margin-top: 0;">🤖 About AIHUB-VVIT</h3>
                <p>We are the student community of VVIT dedicated to leveraging AI to solve real-world problems, learn cutting-edge technologies, and build innovative projects together.</p>
                <p><strong>What we do:</strong></p>
                <ul style="color: #555;">
                  <li>AI/ML Workshops & Seminars</li>
                  <li>Collaborative Projects & Research</li>
                  <li>Hackathons & Competitions</li>
                  <li>Industry Connections & Mentorship</li>
                </ul>
              </div>

              <!-- College Information -->
              <div class="college-info">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/ec/VVIT_Logo.png" alt="VVIT Logo" class="college-logo">
                <div class="college-details">
                  <h3>Vasireddy Venkatadri Institute of Technology</h3>
                  <p>
                    <a href="https://www.vvitguntur.com/" target="_blank">🌐 Visit Website</a> | 
                    <a href="https://www.google.com/maps/place/Vasireddy+Venkatadri+Institute+of+Technology/data=!4m2!3m1!1s0x0:0x8c86e4f36490336b?sa=X&ved=1t:2428&ictx=111" target="_blank">📍 View on Map</a>
                  </p>
                </div>
              </div>

              <!-- Contact Section -->
              <div class="contact-section">
                <h3>📞 Get in Touch</h3>
                <div class="contact-item">
                  <span>📧 Email:</span>
                  <a href="mailto:aihub-vvit@vvit.net">aihub-vvit@vvit.net</a>
                </div>
                <div class="contact-item">
                  <span>🌐 AIHUB Website:</span>
                  <a href="https://aihub-vvitu.social/" target="_blank">aihub-vvitu.social</a>
                </div>
                <div class="contact-item">
                  <span>💻 GitHub Website:</span>
                  <a href="https://aihub-vvit.github.io/" target="_blank">aihub-vvit.github.io</a>
                </div>
                <div class="social-links">
                  <a href="https://github.com/AIHUB-VVIT" target="_blank">💻 GitHub Repo</a>
                  <a href="https://www.vvitguntur.com/" target="_blank">� College Website</a>
                </div>
              </div>

              <!-- Expiry Notice -->
              <div class="expiry-notice">
                ⏰ <strong>Note:</strong> This verification link will expire in 24 hours for security purposes.
              </div>

              <!-- Warning -->
              <div class="warning">
                <strong>⚠️ Didn't create an account?</strong><br>
                If you didn't request this verification email, please ignore it. Your email will not be verified and no account will be created.
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p><strong>AIHUB-VVIT</strong></p>
              <p>Vasireddy Venkatadri Institute of Technology (VVIT)</p>
              <p>Empowering Students through AI & Innovation</p>
              <p style="margin-top: 15px; font-size: 12px; opacity: 0.8;">
                © ${new Date().getFullYear()} AIHUB-VVIT. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Don't auto-login - require email verification first
    console.log(`📧 Verification email sent to: ${user.email}`);
    res.json({ 
      message: 'Signup successful! Please check your email to verify your account.',
      requiresVerification: true,
      email: user.email
    });
  } catch (err) {
    console.error('❌ Signup error:', err.message);
    
    // Handle specific MongoDB duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: 'User already exists with this email address. Please login instead.' 
      });
    }
    
    res.status(500).json({ message: 'Server error during signup. Please try again.' });
  }
});

router.post('/login', async (req, res, next) => {
  if (req.body.remember) {
    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
  }
  
  // BEFORE passport authentication: Check if OAuth user is trying to login with password
  const { email, password } = req.body;
  
  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    // Check if user signed up with Google OAuth
    if (existingUser && existingUser.googleId && !existingUser.password) {
      console.log(`⚠️ OAuth user attempted password login: ${email} (Google)`);
      return res.status(400).json({ 
        message: 'This account was created using Google Sign-In. Please use "Continue with Google" to log in.',
        isOAuthAccount: true,
        provider: 'Google'
      });
    }
    
    // Check if user signed up with Microsoft OAuth
    if (existingUser && existingUser.microsoftId && !existingUser.password) {
      console.log(`⚠️ OAuth user attempted password login: ${email} (Microsoft)`);
      return res.status(400).json({ 
        message: 'This account was created using Microsoft Sign-In. Please use "Continue with Microsoft" to log in.',
        isOAuthAccount: true,
        provider: 'Microsoft'
      });
    }
  } catch (err) {
    console.error('❌ Error checking OAuth user:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
  
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check if user's email is verified (only for manual signup users, not OAuth users)
    if (!user.googleId && !user.microsoftId && !user.isVerified) {
      return res.status(403).json({ 
        message: 'Please verify your email address before logging in. Check your inbox for the verification link.',
        requiresVerification: true
      });
    }
    
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Login failed' });
      }
      res.json({
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          isVerified: user.isVerified
        }
      });
    });
  })(req, res, next);
});

router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email', 'openid'],
  accessType: 'offline',
  prompt: 'consent select_account'  // Force account selection and consent screen every time
}));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:5173/' }), async (req, res) => {
  console.log('🔄 Google Callback - User Check:');
  console.log('   User:', req.user?.name);
  console.log('   Email:', req.user?.email);
  console.log('   isNewSignup flag:', req.user?._isNewGoogleSignup);
  
  // Check if this is a new user signup (flag attached to user object in passport strategy)
  if (req.user && req.user._isNewGoogleSignup) {
    console.log('✅ NEW GOOGLE SIGNUP DETECTED - Sending welcome email...');
    const userName = req.user.name;
    const userEmail = req.user.email;
    
    // Remove the temporary flag
    delete req.user._isNewGoogleSignup;
    
    // Send welcome email for new Google signups
    try {
      await sendEmail({
        to: userEmail,
        subject: '🎉 Welcome to AIHub Family – Registration Successful!',
        text: `Hello ${userName}!\n\nCongratulations! You've successfully joined the AIHUB-VVIT community using your Google account.\n\nYour Registration Details:\n- Name: ${userName}\n- Email: ${userEmail}\n- Registration Method: Google Account\n- Account Status: ✅ Verified & Active\n\nVisit: http://localhost:5173/\n\n© ${new Date().getFullYear()} AIHUB-VVIT`,
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f4f7fa;
              }
              .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 32px;
                font-weight: bold;
              }
              .header p {
                margin: 10px 0 0 0;
                font-size: 18px;
                opacity: 0.9;
              }
              .content {
                padding: 40px 30px;
              }
              .welcome-box {
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                padding: 25px;
                border-radius: 10px;
                margin: 20px 0;
                border-left: 5px solid #667eea;
              }
              .welcome-box h2 {
                margin: 0 0 15px 0;
                color: #5b21b6;
                font-size: 24px;
              }
              .user-info {
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 25px 0;
              }
              .user-info p {
                margin: 10px 0;
                font-size: 16px;
              }
              .user-info strong {
                color: #5b21b6;
                font-weight: 600;
              }
              .next-steps {
                background-color: #e8f4f8;
                padding: 20px;
                border-radius: 8px;
                margin: 25px 0;
                border-left: 4px solid #2196F3;
              }
              .next-steps h3 {
                margin: 0 0 15px 0;
                color: #2196F3;
              }
              .next-steps ul {
                margin: 0;
                padding-left: 20px;
              }
              .next-steps li {
                margin: 10px 0;
                color: #555;
              }
              .cta-button {
                display: inline-block;
                padding: 15px 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white !important;
                text-decoration: none;
                border-radius: 50px;
                font-weight: bold;
                font-size: 16px;
                margin: 20px 0;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                text-align: center;
              }
              .quote-section {
                background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
                padding: 20px;
                border-radius: 8px;
                margin: 30px 0;
                text-align: center;
                border: 2px solid #f39c12;
              }
              .quote-section p {
                margin: 0;
                font-size: 18px;
                font-style: italic;
                color: #2c3e50;
                font-weight: 500;
              }
              .contact-section {
                margin-top: 30px;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 8px;
                color: white;
              }
              .contact-section h3 {
                margin: 0 0 15px 0;
                font-size: 20px;
              }
              .contact-item {
                margin: 10px 0;
              }
              .contact-item a {
                color: white;
                text-decoration: none;
              }
              .footer {
                background-color: #2c3e50;
                color: white;
                text-align: center;
                padding: 20px;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>🎉 Welcome to AIHub Family!</h1>
                <p>Registration Successful</p>
              </div>

              <div class="content">
                <div class="welcome-box">
                  <h2>Hello ${userName}! 👋</h2>
                  <p>Congratulations! You've successfully joined the <strong>AIHUB-VVIT</strong> community. We're thrilled to have you as part of our AI-driven student community at Vasireddy Venkatadri Institute of Technology!</p>
                </div>

                <div class="user-info">
                  <h3 style="margin-top: 0; color: #333;">📋 Your Registration Details:</h3>
                  <p><strong>Name:</strong> ${userName}</p>
                  <p><strong>Email:</strong> ${userEmail}</p>
                  <p><strong>Registration Method:</strong> Google Account</p>
                  <p><strong>Account Status:</strong> ✅ Verified & Active</p>
                  <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div class="next-steps">
                  <h3>🚀 Next Steps:</h3>
                  <ul>
                    <li><strong>Explore Projects:</strong> Check out our ongoing AI/ML projects and contribute</li>
                    <li><strong>Join Workshops:</strong> Participate in upcoming workshops and seminars</li>
                    <li><strong>Connect:</strong> Network with fellow AI enthusiasts and mentors</li>
                    <li><strong>Build:</strong> Start working on your own AI projects with community support</li>
                    <li><strong>Compete:</strong> Join hackathons and competitions to showcase your skills</li>
                  </ul>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="http://localhost:5173/" class="cta-button">🏠 Go to Dashboard</a>
                </div>

                <div class="quote-section">
                  <p>"Inspiration is not tangible unless you make it real."</p>
                </div>

                <div class="contact-section">
                  <h3>📞 Stay Connected</h3>
                  <div class="contact-item">
                    📧 Email: <a href="mailto:aihub-vvit@vvit.net">aihub-vvit@vvit.net</a>
                  </div>
                  <div class="contact-item">
                    🌐 Website: <a href="https://aihub-vvitu.social/" target="_blank">aihub-vvitu.social</a>
                  </div>
                  <div class="contact-item">
                    💻 GitHub: <a href="https://aihub-vvit.github.io/" target="_blank">aihub-vvit.github.io</a>
                  </div>
                  <div class="contact-item">
                    📂 Repository: <a href="https://github.com/AIHUB-VVIT" target="_blank">github.com/AIHUB-VVIT</a>
                  </div>
                </div>

                <p style="margin-top: 30px; text-align: center; color: #666;">
                  <strong>Questions?</strong> We're here to help! Reach out anytime.
                </p>
              </div>

              <div class="footer">
                <p><strong>AIHUB-VVIT</strong></p>
                <p>Vasireddy Venkatadri Institute of Technology (VVIT)</p>
                <p>Empowering Students through AI & Innovation</p>
                <p style="margin-top: 15px; font-size: 12px; opacity: 0.8;">
                  © ${new Date().getFullYear()} AIHUB-VVIT. All rights reserved.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
      console.log('✅ Welcome email sent successfully to:', userEmail);
    } catch (err) {
      console.error('❌ Failed to send welcome email:', err);
      // Don't fail the signup if email fails
    }
  } else {
    console.log('ℹ️ EXISTING GOOGLE USER LOGIN - No email sent');
  }
  
  // Redirect to React app after successful Google auth
  res.redirect('http://localhost:5173/');
});

// Microsoft OAuth Routes
router.get('/microsoft', passport.authenticate('microsoft', { 
  scope: ['user.read'],
  prompt: 'select_account'  // Force account selection every time
}));

router.get('/microsoft/callback', passport.authenticate('microsoft', { failureRedirect: 'http://localhost:5173/' }), async (req, res) => {
  console.log('\n🔄 Microsoft OAuth Callback - User Authentication:');
  console.log('   👤 User:', req.user?.name);
  console.log('   📧 Email:', req.user?.email);
  console.log('   🆕 isNewSignup:', req.user?._isNewMicrosoftSignup);
  
  // Check if this is a new user signup (flag attached to user object in passport strategy)
  if (req.user && req.user._isNewMicrosoftSignup) {
    console.log('\n✅ NEW MICROSOFT SIGNUP DETECTED!');
    console.log('   Preparing to send welcome email...');
    
    const userName = req.user.name;
    const userEmail = req.user.email;
    
    // Remove the temporary flag
    delete req.user._isNewMicrosoftSignup;
    
    // Add a delay to avoid rapid-fire detection (appears more natural)
    console.log('   ⏳ Waiting 2 seconds before sending email...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Send welcome email for new Microsoft signups with retry logic
    try {
      const mailOptions = {
        to: userEmail,
        subject: '🎉 Welcome to AIHub Family – Registration Successful!',
        text: `Hello ${userName}!\n\nCongratulations! You've successfully joined the AIHUB-VVIT community at Vasireddy Venkatadri Institute of Technology.\n\nYour Registration Details:\n- Name: ${userName}\n- Email: ${userEmail}\n- Registration Method: Microsoft Account\n- Account Status: ✅ Verified & Active\n- Registration Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n\nNext Steps:\n1. Explore AI/ML projects and contribute\n2. Participate in workshops and seminars\n3. Network with fellow AI enthusiasts\n4. Build AI projects with community support\n5. Join hackathons and competitions\n\nVisit our platform: http://localhost:5173/\n\nStay Connected:\n📧 Email: aihub-vvit@vvit.net\n🌐 Website: https://aihub-vvitu.social/\n💻 GitHub: https://github.com/AIHUB-VVIT\n\nQuestions? We're here to help!\n\n---\nAIHUB-VVIT\nVasireddy Venkatadri Institute of Technology\nEmpowering Students through AI & Innovation\n\n© ${new Date().getFullYear()} AIHUB-VVIT. All rights reserved.`,
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f4f7fa;
              }
              .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 32px;
                font-weight: bold;
              }
              .header p {
                margin: 10px 0 0 0;
                font-size: 18px;
                opacity: 0.9;
              }
              .content {
                padding: 40px 30px;
              }
              .welcome-box {
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                padding: 25px;
                border-radius: 10px;
                margin: 20px 0;
                border-left: 5px solid #667eea;
              }
              .welcome-box h2 {
                margin: 0 0 15px 0;
                color: #5b21b6;
                font-size: 24px;
              }
              .user-info {
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 25px 0;
              }
              .user-info p {
                margin: 10px 0;
                font-size: 16px;
              }
              .user-info strong {
                color: #5b21b6;
                font-weight: 600;
              }
              .next-steps {
                background-color: #e8f4f8;
                padding: 20px;
                border-radius: 8px;
                margin: 25px 0;
                border-left: 4px solid #2196F3;
              }
              .next-steps h3 {
                margin: 0 0 15px 0;
                color: #2196F3;
              }
              .next-steps ul {
                margin: 0;
                padding-left: 20px;
              }
              .next-steps li {
                margin: 10px 0;
                color: #555;
              }
              .cta-button {
                display: inline-block;
                padding: 15px 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white !important;
                text-decoration: none;
                border-radius: 50px;
                font-weight: bold;
                font-size: 16px;
                margin: 20px 0;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                text-align: center;
              }
              .quote-section {
                background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
                padding: 20px;
                border-radius: 8px;
                margin: 30px 0;
                text-align: center;
                border: 2px solid #f39c12;
              }
              .quote-section p {
                margin: 0;
                font-size: 18px;
                font-style: italic;
                color: #2c3e50;
                font-weight: 500;
              }
              .contact-section {
                margin-top: 30px;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 8px;
                color: white;
              }
              .contact-section h3 {
                margin: 0 0 15px 0;
                font-size: 20px;
              }
              .contact-item {
                margin: 10px 0;
              }
              .contact-item a {
                color: white;
                text-decoration: none;
              }
              .footer {
                background-color: #2c3e50;
                color: white;
                text-align: center;
                padding: 20px;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>🎉 Welcome to AIHub Family!</h1>
                <p>Registration Successful</p>
              </div>

              <div class="content">
                <div class="welcome-box">
                  <h2>Hello ${userName}! 👋</h2>
                  <p>Congratulations! You've successfully joined the <strong>AIHUB-VVIT</strong> community. We're thrilled to have you as part of our AI-driven student community at Vasireddy Venkatadri Institute of Technology!</p>
                </div>

                <div class="user-info">
                  <h3 style="margin-top: 0; color: #333;">📋 Your Registration Details:</h3>
                  <p><strong>Name:</strong> ${userName}</p>
                  <p><strong>Email:</strong> ${userEmail}</p>
                  <p><strong>Registration Method:</strong> Microsoft Account</p>
                  <p><strong>Account Status:</strong> ✅ Verified & Active</p>
                  <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div class="next-steps">
                  <h3>🚀 Next Steps:</h3>
                  <ul>
                    <li><strong>Explore Projects:</strong> Check out our ongoing AI/ML projects and contribute</li>
                    <li><strong>Join Workshops:</strong> Participate in upcoming workshops and seminars</li>
                    <li><strong>Connect:</strong> Network with fellow AI enthusiasts and mentors</li>
                    <li><strong>Build:</strong> Start working on your own AI projects with community support</li>
                    <li><strong>Compete:</strong> Join hackathons and competitions to showcase your skills</li>
                  </ul>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="http://localhost:5173/" class="cta-button">🏠 Go to Dashboard</a>
                </div>

                <div class="quote-section">
                  <p>"Inspiration is not tangible unless you make it real."</p>
                </div>

                <div class="contact-section">
                  <h3>📞 Stay Connected</h3>
                  <div class="contact-item">
                    📧 Email: <a href="mailto:aihub-vvit@vvit.net">aihub-vvit@vvit.net</a>
                  </div>
                  <div class="contact-item">
                    🌐 Website: <a href="https://aihub-vvitu.social/" target="_blank">aihub-vvitu.social</a>
                  </div>
                  <div class="contact-item">
                    💻 GitHub: <a href="https://aihub-vvit.github.io/" target="_blank">aihub-vvit.github.io</a>
                  </div>
                  <div class="contact-item">
                    📂 Repository: <a href="https://github.com/AIHUB-VVIT" target="_blank">github.com/AIHUB-VVIT</a>
                  </div>
                </div>

                <p style="margin-top: 30px; text-align: center; color: #666;">
                  <strong>Questions?</strong> We're here to help! Reach out anytime.
                </p>
              </div>

              <div class="footer">
                <p><strong>AIHUB-VVIT</strong></p>
                <p>Vasireddy Venkatadri Institute of Technology (VVIT)</p>
                <p>Empowering Students through AI & Innovation</p>
                <p style="margin-top: 15px; font-size: 12px; opacity: 0.8;">
                  © ${new Date().getFullYear()} AIHUB-VVIT. All rights reserved.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      };
      
      console.log('   📤 Sending email now...');
      await sendEmail(mailOptions);
      console.log('✅ SUCCESS! Welcome email delivered to:', userEmail);
    } catch (err) {
      console.error('\n❌ CRITICAL: Failed to send welcome email!');
      console.error('   Error:', err.message);
      console.error('   User email:', userEmail);
      console.error('   💡 Check AZURE_EMAIL_GUIDE.md for solutions');
      // Don't fail the signup if email fails - user is still registered
    }
  } else {
    console.log('\nℹ️  EXISTING MICROSOFT USER LOGIN - Skipping email (already sent during signup)');
  }
  
  // Redirect to React app after successful Microsoft auth
  console.log('   🔄 Redirecting user to dashboard...\n');
  res.redirect('http://localhost:5173/');
});

router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { 
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logout successful' });
  });
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ message: 'If a user with that email exists, a password reset link has been sent.' });
    }

    // ======= OAUTH USER PROTECTION - PREVENT PASSWORD RESET =======
    
    // Check if user signed up with Google OAuth
    if (user.googleId && !user.password) {
      console.log(`⚠️ OAuth user attempted password reset: ${email} (Google)`);
      return res.status(400).json({ 
        message: 'This account was created using Google Sign-In. Please use "Continue with Google" to log in. Password reset is not available for Google accounts.',
        isOAuthAccount: true,
        provider: 'Google'
      });
    }

    // Check if user signed up with Microsoft OAuth
    if (user.microsoftId && !user.password) {
      console.log(`⚠️ OAuth user attempted password reset: ${email} (Microsoft)`);
      return res.status(400).json({ 
        message: 'This account was created using Microsoft Sign-In. Please use "Continue with Microsoft" to log in. Password reset is not available for Microsoft accounts.',
        isOAuthAccount: true,
        provider: 'Microsoft'
      });
    }

    // Check if user has no password set (general OAuth user - fallback)
    if (!user.password) {
      console.log(`⚠️ OAuth user (unknown provider) attempted password reset: ${email}`);
      return res.status(400).json({ 
        message: 'This account was created using social login (Google/Microsoft). Please use the appropriate social login button to access your account.',
        isOAuthAccount: true
      });
    }
    
    // ======= END OAUTH PROTECTION =======

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const url = `http://localhost:5173/reset-password/${token}`;

    await sendEmail({
      to: user.email,
      subject: '🔐 Password Reset Request - AIHUB-VVIT',
      text: `Password Reset Request\n\nHello,\n\nWe received a request to reset your password. Click this link to reset:\n${url}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\n© ${new Date().getFullYear()} AIHUB-VVIT`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f4f7fa;
            }
            .email-container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
              color: white;
              padding: 30px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: bold;
            }
            .content {
              padding: 40px 30px;
            }
            .reset-button {
              display: inline-block;
              padding: 15px 40px;
              background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
              color: white !important;
              text-decoration: none;
              border-radius: 50px;
              font-weight: bold;
              font-size: 16px;
              margin: 20px 0;
              box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
            }
            .warning {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
              color: #856404;
            }
            .security-notice {
              background-color: #e7f3ff;
              border-left: 4px solid #2196F3;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
              color: #0d47a1;
            }
            .footer {
              background-color: #2c3e50;
              color: white;
              text-align: center;
              padding: 20px;
              font-size: 14px;
            }
            .expiry-notice {
              font-size: 14px;
              color: #d32f2f;
              margin-top: 20px;
              padding: 10px;
              background-color: #ffebee;
              border-radius: 5px;
              text-align: center;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>

            <div class="content">
              <h2>Hello ${user.name},</h2>
              <p>We received a request to reset your password for your AIHUB-VVIT account.</p>
              
              <p>If you made this request, click the button below to reset your password:</p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${url}" class="reset-button">🔑 Click Here to Reset Password</a>
              </div>

              <div class="expiry-notice">
                ⏰ This link will expire in 1 hour for security reasons.
              </div>

              <div class="security-notice">
                <strong>🔒 Security Tips:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Use a strong password with at least 8 characters</li>
                  <li>Include uppercase, lowercase, numbers, and symbols</li>
                  <li>Don't reuse passwords from other accounts</li>
                  <li>Never share your password with anyone</li>
                </ul>
              </div>

              <div class="warning">
                <strong>⚠️ Didn't request a password reset?</strong><br>
                If you didn't request this, please ignore this email. Your password will remain unchanged and your account is secure. Someone may have entered your email address by mistake.
              </div>

              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                <strong>Need help?</strong> Contact us at <a href="mailto:aihub-vvit@vvit.net" style="color: #2563eb;">aihub-vvit@vvit.net</a>
              </p>

              <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; font-size: 14px;">
                <strong>🔗 AIHUB-VVIT Resources:</strong><br>
                <p style="margin: 10px 0;">
                  🌐 Official Website: <a href="https://aihub-vvitu.social/" target="_blank" style="color: #2563eb;">aihub-vvitu.social</a><br>
                  💻 GitHub Website: <a href="https://aihub-vvit.github.io/" target="_blank" style="color: #2563eb;">aihub-vvit.github.io</a><br>
                  📂 GitHub Repository: <a href="https://github.com/AIHUB-VVIT" target="_blank" style="color: #2563eb;">github.com/AIHUB-VVIT</a>
                </p>
              </div>
            </div>

            <div class="footer">
              <p><strong>AIHUB-VVIT</strong></p>
              <p>Vasireddy Venkatadri Institute of Technology (VVIT)</p>
              <p style="margin-top: 10px; font-size: 12px; opacity: 0.8;">
                © ${new Date().getFullYear()} AIHUB-VVIT. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Set password directly - the pre-save hook will hash it
    user.password = password;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Invalid or expired token' });
  }
});

router.get('/verify-email/:token', async (req, res) => {
    try {
        const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            console.log('❌ Email verification failed: User not found');
            return res.redirect('http://localhost:5173/verification-error?message=Invalid token');
        }

        // Check if already verified (prevent duplicate welcome emails)
        if (user.isVerified) {
            console.log(`ℹ️ User ${user.email} already verified, skipping welcome email`);
            return res.redirect('http://localhost:5173/verification-success');
        }

        // Mark as verified
        user.isVerified = true;
        await user.save();
        console.log(`✅ Email verified for user: ${user.email}`);

        // Send welcome email after successful verification
        try {
            await sendEmail({
                to: user.email,
                subject: '🎉 Welcome to AIHub Family – Registration Successful!',
                text: `Hello ${user.name}!\n\nCongratulations! Your email has been verified and you're now part of AIHUB-VVIT.\n\nYour Account Details:\n- Name: ${user.name}\n- Email: ${user.email}\n- Status: ✅ Verified\n\nVisit: http://localhost:5173/\n\n© ${new Date().getFullYear()} AIHUB-VVIT`,
                html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    body {
                      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                      line-height: 1.6;
                      color: #333;
                      margin: 0;
                      padding: 0;
                      background-color: #f4f7fa;
                    }
                    .email-container {
                      max-width: 600px;
                      margin: 20px auto;
                      background-color: #ffffff;
                      border-radius: 12px;
                      overflow: hidden;
                      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      color: white;
                      padding: 30px 20px;
                      text-align: center;
                    }
                    .header h1 {
                      margin: 0;
                      font-size: 28px;
                      font-weight: bold;
                    }
                    .content {
                      padding: 40px 30px;
                    }
                    .welcome-box {
                      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                      padding: 25px;
                      border-radius: 10px;
                      margin: 20px 0;
                      text-align: center;
                    }
                    .welcome-box h2 {
                      color: #5b21b6;
                      margin: 0 0 10px 0;
                    }
                    .user-details {
                      background-color: #f8f9fa;
                      padding: 20px;
                      border-radius: 8px;
                      margin: 20px 0;
                    }
                    .user-details table {
                      width: 100%;
                      border-collapse: collapse;
                    }
                    .user-details td {
                      padding: 10px;
                      border-bottom: 1px solid #e0e0e0;
                    }
                    .user-details td:first-child {
                      font-weight: bold;
                      color: #5b21b6;
                      width: 40%;
                    }
                    .cta-button {
                      display: inline-block;
                      padding: 15px 40px;
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      color: white !important;
                      text-decoration: none;
                      border-radius: 50px;
                      font-weight: bold;
                      font-size: 16px;
                      margin: 20px 0;
                      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                    }
                    .next-steps {
                      background-color: #f8f9fa;
                      padding: 20px;
                      border-radius: 8px;
                      margin: 20px 0;
                    }
                    .next-steps h3 {
                      color: #5b21b6;
                      margin-top: 0;
                    }
                    .next-steps ul {
                      padding-left: 20px;
                    }
                    .next-steps li {
                      margin: 10px 0;
                    }
                    .quote-section {
                      background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
                      padding: 20px;
                      border-radius: 8px;
                      margin: 30px 0;
                      border-left: 4px solid #f39c12;
                    }
                    .quote-section p {
                      margin: 0;
                      font-style: italic;
                      color: #2d3436;
                      font-size: 16px;
                    }
                    .quote-section .quote-author {
                      margin-top: 10px;
                      font-weight: bold;
                      color: #d63031;
                      font-style: normal;
                    }
                    .contact-section {
                      background-color: #f8f9fa;
                      padding: 20px;
                      border-radius: 8px;
                      margin: 20px 0;
                    }
                    .contact-section h3 {
                      color: #5b21b6;
                      margin-top: 0;
                    }
                    .contact-links {
                      display: flex;
                      flex-wrap: wrap;
                      gap: 10px;
                      margin: 15px 0;
                    }
                    .contact-links a {
                      display: inline-block;
                      padding: 8px 16px;
                      background-color: white;
                      color: #5b21b6;
                      text-decoration: none;
                      border-radius: 20px;
                      border: 2px solid #667eea;
                      font-size: 14px;
                      transition: all 0.3s ease;
                    }
                    .contact-links a:hover {
                      background-color: #5b21b6;
                      color: white;
                    }
                    .footer {
                      background-color: #2d3436;
                      color: white;
                      text-align: center;
                      padding: 20px;
                      font-size: 14px;
                    }
                  </style>
                </head>
                <body>
                  <div class="email-container">
                    <div class="header">
                      <h1>🎉 Welcome to AIHub Family!</h1>
                      <p>Your account is now active</p>
                    </div>
                    <div class="content">
                      <div class="welcome-box">
                        <h2>Hello ${user.name}! 👋</h2>
                        <p>Welcome to AIHub - VVIT's Premier AI & Innovation Hub</p>
                      </div>

                      <p>Congratulations! Your email has been successfully verified and your AIHub account is now fully activated.</p>

                      <div class="user-details">
                        <h3 style="color: #5b21b6; margin-top: 0;">📋 Your Registration Details</h3>
                        <table>
                          <tr>
                            <td>Name:</td>
                            <td>${user.name}</td>
                          </tr>
                          <tr>
                            <td>Email:</td>
                            <td>${user.email}</td>
                          </tr>
                          <tr>
                            <td>Registration Method:</td>
                            <td>Email & Password</td>
                          </tr>
                          <tr>
                            <td>Account Status:</td>
                            <td><strong style="color: #00b894;">✓ Verified</strong></td>
                          </tr>
                          <tr>
                            <td>Registration Date:</td>
                            <td>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                          </tr>
                        </table>
                      </div>

                      <div class="next-steps">
                        <h3>🚀 Next Steps</h3>
                        <ul>
                          <li><strong>Explore Projects:</strong> Browse our AI and ML projects repository</li>
                          <li><strong>Join Workshops:</strong> Participate in upcoming AI workshops and hackathons</li>
                          <li><strong>Connect:</strong> Network with fellow AI enthusiasts and innovators</li>
                          <li><strong>Build:</strong> Start working on your own AI projects with our resources</li>
                          <li><strong>Compete:</strong> Take part in coding competitions and challenges</li>
                        </ul>
                      </div>

                      <div style="text-align: center;">
                        <a href="http://localhost:5173/" class="cta-button">Go to Dashboard</a>
                      </div>

                      <div class="quote-section">
                        <p>"The future belongs to those who believe in the beauty of their dreams. Start building your AI journey today!"</p>
                        <p class="quote-author">- AIHub Team, VVIT</p>
                      </div>

                      <div class="contact-section">
                        <h3>📬 Stay Connected</h3>
                        <p>Have questions? Need assistance? We're here to help!</p>
                        <div class="contact-links">
                          <a href="mailto:aihub.vvit@gmail.com">✉️ Email Us</a>
                          <a href="https://aihub-vvitu.social">🌐 Visit Website</a>
                          <a href="https://aihub-vvit.github.io">📖 GitHub Pages</a>
                          <a href="https://github.com/AIHUB-VVIT">💻 GitHub Repo</a>
                        </div>
                      </div>

                      <p style="color: #666; font-size: 14px; margin-top: 30px;">
                        <strong>AIHub - VVIT</strong><br>
                        Vasireddy Venkatadri Institute of Technology<br>
                        Empowering Innovation Through Artificial Intelligence
                      </p>
                    </div>
                    <div class="footer">
                      <p>&copy; ${new Date().getFullYear()} AIHub - VVIT. All rights reserved.</p>
                      <p style="margin-top: 10px; opacity: 0.8;">This email was sent because you registered an account on AIHub.</p>
                    </div>
                  </div>
                </body>
                </html>
                `
            });
            console.log(`📧 Welcome email sent to: ${user.email}`);
        } catch (emailError) {
            console.error('❌ Error sending welcome email:', emailError.message);
            // Don't fail verification if email fails - user is still verified
        }

        res.redirect('http://localhost:5173/verification-success');
    } catch (err) {
        console.error('❌ Email verification error:', err.message);
        res.redirect('http://localhost:5173/verification-error?message=Invalid or expired token');
    }
});


module.exports = router;


