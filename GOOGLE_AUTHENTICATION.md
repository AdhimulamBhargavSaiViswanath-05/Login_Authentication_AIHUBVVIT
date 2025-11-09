# 🔐 Google Authentication Setup Guide

## Complete Guide to Implementing Google OAuth 2.0 in AIHub

This guide provides step-by-step instructions for setting up and implementing Google OAuth 2.0 authentication in the AIHub platform.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Google Cloud Console Setup](#google-cloud-console-setup)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)

---

## 🎯 Overview

### What is Google OAuth 2.0?

Google OAuth 2.0 is an authorization framework that allows third-party applications to access user information from Google without exposing passwords. In AIHub, users can sign in using their Google accounts instead of creating new credentials.

### Authentication Flow

```
User clicks "Sign in with Google"
            ↓
Redirect to Google Login
            ↓
User selects Google account
            ↓
User grants permissions
            ↓
Google redirects back with code
            ↓
Backend exchanges code for tokens
            ↓
Backend fetches user profile
            ↓
Create/login user in database
            ↓
Create session and redirect to dashboard
```

### Benefits

- ✅ **No Password Management**: Users don't need to remember another password
- ✅ **Faster Registration**: One-click signup process
- ✅ **Trusted Platform**: Users trust Google's security
- ✅ **Auto-Verified**: Email automatically verified by Google (no need for additional verification)
- ✅ **Better UX**: Seamless authentication experience with immediate access

---

## 🛠️ Google Cloud Console Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown (top-left)
3. Click **"New Project"**
4. Enter project details:
   - **Project Name**: `AIHub VVIT` (or your preferred name)
   - **Organization**: (Optional) Select your organization
   - **Location**: (Optional) Select location
5. Click **"Create"**

### Step 2: Enable Google+ API

1. In the Google Cloud Console, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"**
3. Click on it and click **"Enable"**

### Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **User Type**:
   - **Internal**: Only for G Suite organization users (if you have one)
   - **External**: For any Google user (recommended for AIHub)
3. Click **"Create"**

#### OAuth Consent Screen Configuration

**App Information:**
```
App name: AIHub VVIT
User support email: [your-email@vvit.net]
App logo: (Optional) Upload your logo
```

**App Domain:**
```
Application home page: http://localhost:3000 (dev) or https://yourdomain.com (prod)
Application privacy policy link: (Optional)
Application terms of service link: (Optional)
```

**Authorized Domains:**
```
localhost (for development)
yourdomain.com (for production)
```

**Developer Contact Information:**
```
Email addresses: [your-email@vvit.net]
```

4. Click **"Save and Continue"**

**Scopes Configuration:**

5. Click **"Add or Remove Scopes"**
6. Select the following scopes:
   - `../auth/userinfo.email` - View your email address
   - `../auth/userinfo.profile` - View your basic profile info
7. Click **"Update"** then **"Save and Continue"**

**Test Users (for External apps in testing):**

8. Add test users:
   - Click **"Add Users"**
   - Enter test email addresses (e.g., your VVIT email)
   - Click **"Add"**
9. Click **"Save and Continue"**

10. Review summary and click **"Back to Dashboard"**

### Step 4: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ Create Credentials"** → **"OAuth client ID"**
3. Configure credentials:

```
Application type: Web application
Name: AIHub OAuth Client

Authorized JavaScript origins:
  - http://localhost:3000
  - http://localhost:5173
  - http://localhost:5174
  (Add production URLs later)

Authorized redirect URIs:
  - http://localhost:3000/auth/google/callback
  (Add production callback URL later)
```

4. Click **"Create"**

### Step 5: Save Credentials

You'll see a popup with:
- **Client ID**: `1234567890-abcdefghijklmnop.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-xxxxxxxxxxxxxxxxxxxxx`

⚠️ **IMPORTANT**: Copy these immediately and store them securely!

---

## 💻 Backend Implementation

### Step 1: Install Required Packages

```bash
npm install passport passport-google-oauth20
```

### Step 2: Environment Configuration

Add to `.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=1234567890-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxx
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Frontend URL (for redirects)
CLIENT_URL=http://localhost:5173
```

### Step 3: Update User Model

Ensure your `models/User.js` includes Google-specific fields:

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      // Password not required if signing up with Google
      return !this.googleId;
    }
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password comparison method
userSchema.methods.comparePassword = function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### Step 4: Configure Passport Google Strategy

Create or update `config/passport.js`:

```javascript
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  proxy: true // Trust proxy (important for production)
},
async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('\n🔍 Google Profile Received:');
    console.log('   ID:', profile.id);
    console.log('   Name:', profile.displayName);
    console.log('   Email:', profile.emails[0].value);
    
    // Check if user already exists
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      console.log('   ✅ Existing user found');
      return done(null, user);
    }
    
    // Check if user exists with same email (from local signup)
    user = await User.findOne({ email: profile.emails[0].value.toLowerCase() });
    
    if (user) {
      // Link Google account to existing user and mark as verified
      console.log('   🔗 Linking Google to existing user');
      user.googleId = profile.id;
      user.isVerified = true; // Auto-verify when linking OAuth account
      user.profilePicture = profile.photos[0].value; // Update profile picture
      await user.save();
      return done(null, user);
    }
    
    // Create new user
    console.log('   🆕 Creating new user');
    user = await User.create({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value.toLowerCase(),
      profilePicture: profile.photos[0].value,
      isVerified: true // Google OAuth users are pre-verified by Google
    });
    
    console.log('   ✅ New user created:', user._id);
    
    // Mark as new signup for welcome email
    user.isNewSignup = true;
    
    return done(null, user);
  } catch (error) {
    console.error('   ❌ Google Strategy Error:', error);
    return done(error, null);
  }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
```

### Step 5: Create Authentication Routes

Add to `routes/auth.js`:

```javascript
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { sendEmail } = require('../services/emailService');

// Google OAuth - Initiate authentication
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account' // Always show account selection
  })
);

// Google OAuth - Callback handler
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: true
  }),
  async (req, res) => {
    try {
      console.log('\n🔄 Google OAuth Callback:');
      console.log('   👤 User:', req.user.name);
      console.log('   📧 Email:', req.user.email);
      console.log('   🆕 New Signup:', !!req.user.isNewSignup);
      
      // Send welcome email for new users
      if (req.user.isNewSignup) {
        console.log('   📧 Sending welcome email...');
        
        const welcomeEmail = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Welcome to AIHub!</h1>
              </div>
              <div class="content">
                <h2>Hello ${req.user.name}! 👋</h2>
                <p>Thank you for joining the <strong>AIHub VVIT Community</strong> using your Google account!</p>
                <p>Your account has been created and verified automatically. You can now access all features of the platform.</p>
                <p style="text-align: center;">
                  <a href="${process.env.CLIENT_URL}/dashboard" class="button">Go to Dashboard</a>
                </p>
                <h3>What's Next?</h3>
                <ul>
                  <li>✅ Complete your profile</li>
                  <li>✅ Explore AI resources</li>
                  <li>✅ Connect with fellow students</li>
                  <li>✅ Join community discussions</li>
                </ul>
                <p>If you have any questions, feel free to reach out to our support team.</p>
              </div>
              <div class="footer">
                <p>© 2025 AIHub VVIT. All rights reserved.</p>
                <p>Vasireddy Venkatadri Institute of Technology</p>
              </div>
            </div>
          </body>
          </html>
        `;
        
        await sendEmail(
          req.user.email,
          '🎉 Welcome to AIHub Family – Registration Successful!',
          welcomeEmail
        );
        
        // Clear the flag
        delete req.user.isNewSignup;
        
        console.log('   ✅ Welcome email sent successfully');
      }
      
      // Redirect to dashboard
      res.redirect(`${process.env.CLIENT_URL}/dashboard?login=success`);
    } catch (error) {
      console.error('   ❌ Callback Error:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }
  }
);

module.exports = router;
```

### Step 6: Initialize Passport in Server

Update `server.js`:

```javascript
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./config/passport'); // Import configured passport
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

// Session configuration (MUST be before passport)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    secure: false // Set to true in production with HTTPS
  }
}));

// Passport initialization (MUST be after session)
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## 🎨 Frontend Implementation

### Step 1: Create Google Sign-In Button

Update `src/pages/Login.jsx`:

```javascript
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <div className="login-container">
      <h2>Login to AIHub</h2>
      
      {/* Local login form */}
      <form>
        {/* ... email/password fields ... */}
      </form>
      
      <div className="divider">
        <span>OR</span>
      </div>
      
      {/* Google Sign-In Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="google-signin-btn"
      >
        <img 
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
          alt="Google"
        />
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
```

### Step 2: Add CSS Styling

Add to `src/styles/pages.css`:

```css
/* Google Sign-In Button */
.google-signin-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 12px;
  margin-top: 15px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.google-signin-btn:hover {
  background: #f8f9fa;
  border-color: #4285f4;
  box-shadow: 0 2px 8px rgba(66, 133, 244, 0.3);
}

.google-signin-btn img {
  width: 20px;
  height: 20px;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.divider span {
  padding: 0 15px;
  color: #666;
  font-size: 14px;
}
```

### Step 3: Handle OAuth Callback in Frontend

Update `src/App.jsx`:

```javascript
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for OAuth success/error in URL
    const params = new URLSearchParams(location.search);
    
    if (params.get('login') === 'success') {
      // Show success message
      alert('Successfully logged in with Google!');
      // Clean URL
      navigate('/dashboard', { replace: true });
    }
    
    if (params.get('error') === 'auth_failed') {
      // Show error message
      alert('Authentication failed. Please try again.');
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  return (
    // ... your app routes ...
  );
}
```

---

## 🧪 Testing

### Test Checklist

- [ ] **First-time Google Signup**
  1. Click "Sign in with Google"
  2. Select Google account
  3. Grant permissions
  4. Verify redirect to dashboard
  5. Check MongoDB for new user
  6. Verify welcome email received

- [ ] **Existing Google User Login**
  1. Click "Sign in with Google"
  2. Select same Google account
  3. Verify immediate redirect to dashboard
  4. Confirm no duplicate user in database

- [ ] **Link Google to Existing Local Account**
  1. Create local account with email (e.g., test@gmail.com)
  2. Logout
  3. Sign in with Google using same email
  4. Verify account linked (googleId added to user)
  5. Verify no duplicate user created

- [ ] **Session Persistence**
  1. Login with Google
  2. Refresh page
  3. Verify still logged in
  4. Close and reopen browser
  5. Verify still logged in (within cookie maxAge)

- [ ] **Logout**
  1. Click logout button
  2. Verify redirect to home
  3. Verify cannot access protected routes
  4. Verify session cleared in MongoDB

---

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"

**Problem**: OAuth callback URL doesn't match Google Console configuration

**Solution**:
1. Check Google Cloud Console → Credentials → OAuth 2.0 Client
2. Verify "Authorized redirect URIs" exactly matches:
   ```
   http://localhost:3000/auth/google/callback
   ```
3. Check `.env` file has same URL:
   ```env
   GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
   ```
4. No trailing slashes!
5. Save changes and wait 5 minutes for propagation

### Error: "Access blocked: This app's request is invalid"

**Problem**: OAuth consent screen not configured properly

**Solution**:
1. Go to Google Cloud Console → OAuth consent screen
2. Ensure all required fields are filled
3. Add your test email to "Test users" list
4. Publish app or keep in testing mode with authorized users

### Error: "User profile email is undefined"

**Problem**: Email scope not requested or user denied email permission

**Solution**:
```javascript
// Ensure email scope is included
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'] // Must include 'email'
  })
);
```

### User Not Being Created in Database

**Problem**: Mongoose schema validation or connection issues

**Solution**:
1. Check MongoDB connection:
   ```javascript
   mongoose.connection.on('connected', () => {
     console.log('✅ MongoDB connected');
   });
   ```
2. Add detailed logging in Passport strategy
3. Check server console for errors
4. Verify User model schema allows googleId

### Session Not Persisting

**Problem**: Session middleware configuration issues

**Solution**:
1. Ensure session middleware is BEFORE passport:
   ```javascript
   app.use(session({...}));
   app.use(passport.initialize());
   app.use(passport.session());
   ```
2. Verify MongoStore connection
3. Check cookie settings (httpOnly, secure, domain)
4. Ensure credentials: true in CORS

---

## ✅ Best Practices

### Security

1. **Never expose secrets**:
   ```javascript
   // ❌ Bad
   const clientSecret = 'GOCSPX-xxxxx';
   
   // ✅ Good
   const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
   ```

2. **Use HTTPS in production**:
   ```javascript
   cookie: {
     secure: process.env.NODE_ENV === 'production',
     sameSite: 'lax'
   }
   ```

3. **Validate user data**:
   ```javascript
   if (!profile.emails || !profile.emails[0]) {
     return done(new Error('Email not provided by Google'));
   }
   ```

### User Experience

1. **Show loading state**:
   ```javascript
   const [loading, setLoading] = useState(false);
   
   const handleGoogleLogin = () => {
     setLoading(true);
     window.location.href = 'http://localhost:3000/auth/google';
   };
   ```

2. **Handle errors gracefully**:
   ```javascript
   if (params.get('error')) {
     toast.error('Authentication failed. Please try again.');
   }
   ```

3. **Prompt account selection**:
   ```javascript
   passport.authenticate('google', {
     scope: ['profile', 'email'],
     prompt: 'select_account' // User always selects account
   })
   ```

### Development

1. **Comprehensive logging**:
   ```javascript
   console.log('🔍 Google Profile:', {
     id: profile.id,
     name: profile.displayName,
     email: profile.emails[0].value
   });
   ```

2. **Error handling**:
   ```javascript
   try {
     // OAuth logic
   } catch (error) {
     console.error('❌ Google OAuth Error:', error);
     return done(error, null);
   }
   ```

3. **Test with multiple accounts**:
   - Personal Gmail
   - Work/school Google account
   - New Google account

---

## 📚 Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport Google OAuth20 Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)

---

**Google Authentication successfully implemented in AIHub! 🎉**

For Microsoft authentication, see [MICROSOFT_AUTHENTICATION.md](./MICROSOFT_AUTHENTICATION.md)
