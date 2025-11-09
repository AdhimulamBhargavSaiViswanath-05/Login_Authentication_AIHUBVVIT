# 🔐 Microsoft Authentication Setup Guide

## Complete Guide to Implementing Microsoft OAuth 2.0 & Graph API in AIHub

This comprehensive guide covers Microsoft OAuth 2.0 authentication integration and Microsoft Graph API setup for email delivery in the AIHub platform.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Azure Portal Setup](#azure-portal-setup)
3. [OAuth 2.0 Implementation](#oauth-20-implementation)
4. [Microsoft Graph API Setup](#microsoft-graph-api-setup)
5. [Backend Implementation](#backend-implementation)
6. [Frontend Implementation](#frontend-implementation)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)

---

## 🎯 Overview

### What is Microsoft OAuth 2.0?

Microsoft OAuth 2.0 (powered by Azure Entra ID, formerly Azure Active Directory) allows users to sign in using their Microsoft accounts (@outlook.com, @hotmail.com, @live.com) or organizational accounts (@vvit.net).

### What is Microsoft Graph API?

Microsoft Graph API is a unified API endpoint that provides access to Microsoft 365 services, including:
- Sending emails from organizational accounts
- Accessing user profiles
- Calendar, OneDrive, Teams integration
- And more

### Why Use Both?

```
┌─────────────────────────────────────────────────────┐
│  OAuth 2.0          vs          Graph API           │
├─────────────────────────────────────────────────────┤
│  User Login/Signup     |     Sending Emails         │
│  Authentication        |     Service Integration    │
│  Multi-tenant          |     Organization-specific  │
│  Any Microsoft account |     Institutional email    │
│  Auto-verified email   |     No spam blocking       │
└─────────────────────────────────────────────────────┘
```

### Authentication + Email Flow

```
User clicks "Sign in with Microsoft"
            ↓
OAuth 2.0: Authenticate user
            ↓
Create/login user in database
            ↓
Graph API: Send welcome email from @vvit.net
            ↓
User receives email from institutional domain
            ↓
Better deliverability, no spam blocking
```

---

## 🛠️ Azure Portal Setup

### Part 1: Create App Registration

#### Step 1: Access Azure Portal

1. Go to [Azure Portal](https://portal.azure.com/)
2. Sign in with your Microsoft account
3. Search for **"Azure Entra ID"** (or "Azure Active Directory")
4. Click on **"App registrations"** in the left sidebar

#### Step 2: Register New Application

1. Click **"+ New registration"**
2. Fill in the details:

```
Name: AIHub VVIT Platform
(Choose a descriptive name)

Supported account types:
  ○ Accounts in this organizational directory only (Single tenant)
  ○ Accounts in any organizational directory (Multi-tenant)
  ● Accounts in any organizational directory and personal Microsoft accounts
     (Recommended for AIHub - allows @outlook.com, @vvit.net, etc.)
  ○ Personal Microsoft accounts only

Redirect URI:
  Platform: Web
  URI: http://localhost:3000/auth/microsoft/callback
```

3. Click **"Register"**

#### Step 3: Note Your Credentials

After registration, you'll see the **Overview** page. Copy these values:

```
Application (client) ID: 3103836f-a6c1-49c8-8d47-04fedf2c4cad
Directory (tenant) ID: f6981b0a-3915-4628-be7e-368196415f8f
(Your actual values will be different)
```

⚠️ **IMPORTANT**: Save these immediately!

#### Step 4: Create Client Secret

1. Click **"Certificates & secrets"** in the left menu
2. Click **"+ New client secret"**
3. Fill in details:
   ```
   Description: AIHub Backend Secret
   Expires: 24 months (recommended) or custom
   ```
4. Click **"Add"**
5. **IMMEDIATELY copy the "Value"** field:
   ```
   Value: YOUR_CLIENT_SECRET_HERE
   ```

⚠️ **CRITICAL**: You can only see this secret ONCE! If you lose it, you must create a new one.

#### Step 5: Configure Redirect URIs

1. Click **"Authentication"** in the left menu
2. Under "Platform configurations" → "Web"
3. Ensure redirect URIs are set:
   ```
   http://localhost:3000/auth/microsoft/callback
   ```
4. For production, add:
   ```
   https://yourdomain.com/auth/microsoft/callback
   ```

#### Step 6: Configure Token Settings

Still in **Authentication**:

1. **Implicit grant and hybrid flows**:
   - ☑️ ID tokens (for OAuth 2.0 implicit flow)
   - Leave "Access tokens" unchecked

2. **Advanced settings**:
   - Allow public client flows: **No**

3. Click **"Save"**

---

### Part 2: API Permissions for OAuth

#### Step 1: Set Basic Permissions

1. Click **"API permissions"** in the left menu
2. You should see default **Microsoft Graph** permissions:
   ```
   ✓ User.Read (Delegated) - Sign in and read user profile
   ```

#### Step 2: Add Additional Permissions (if needed)

For basic authentication, `User.Read` is sufficient. If you need more:

1. Click **"+ Add a permission"**
2. Select **"Microsoft Graph"**
3. Select **"Delegated permissions"**
4. Choose permissions:
   - `User.Read` - View user's basic profile (already added)
   - `email` - View user's email address (optional)
   - `profile` - View user's basic profile (optional)

⚠️ **Note**: Admin consent is NOT required for delegated permissions for user's own data.

---

### Part 3: API Permissions for Graph API (Email Sending)

#### Why Separate Permissions?

```
OAuth Permissions (Delegated)
  → User gives permission for app to access THEIR data
  → Works on user's behalf
  → No admin consent needed

Graph API Permissions (Application)
  → App has its own permissions
  → Works independently of user
  → Requires admin consent
  → Needed to send emails from institutional account
```

#### Step 1: Add Mail.Send Permission

1. Still in **"API permissions"**
2. Click **"+ Add a permission"**
3. Select **"Microsoft Graph"**
4. Select **"Application permissions"** (NOT Delegated!)
5. In the search box, type: `Mail.Send`
6. Expand **"Mail"** category
7. Check ☑️ **"Mail.Send"** - Send mail as any user
8. Click **"Add permissions"**

#### Step 2: Grant Admin Consent (CRITICAL!)

⚠️ **This is the most important step for email sending!**

1. Back on API permissions page, you'll see:
   ```
   Mail.Send | Application | ⚠️ Not granted for [Organization]
   ```

2. Click **"✓ Grant admin consent for [Your Organization]"**
3. A popup will ask for confirmation
4. Click **"Yes"**
5. Wait for the status to update:
   ```
   Mail.Send | Application | ✅ Granted for [Organization]
   ```

#### Step 3: Verify Final Permissions

Your API permissions should look like:

```
┌──────────────┬─────────────┬────────────────────────────────┐
│ API/Name     │ Type        │ Status                         │
├──────────────┼─────────────┼────────────────────────────────┤
│ User.Read    │ Delegated   │ ✅ Granted for [Organization]  │
│ Mail.Send    │ Application │ ✅ Granted for [Organization]  │
└──────────────┴─────────────┴────────────────────────────────┘
```

---

### Part 4: Understanding Tenant IDs

#### Multi-Tenant vs Single-Tenant

```javascript
// For OAuth 2.0 (any Microsoft account can sign in)
MICROSOFT_TENANT_ID=common

// For Graph API (organization-specific email sending)
const credential = new ClientSecretCredential(
  'f6981b0a-3915-4628-be7e-368196415f8f', // VVIT tenant
  CLIENT_ID,
  CLIENT_SECRET
);
```

#### Tenant Values Explained

| Value | Description | Use Case |
|-------|-------------|----------|
| `common` | Multi-tenant: Any Microsoft account | OAuth login |
| `organizations` | Work/school accounts only | Organizational apps |
| `consumers` | Personal accounts only (@outlook.com) | Consumer apps |
| `{tenant-id}` | Specific organization | Graph API, single org |

#### Our Configuration Strategy

```env
# .env file
MICROSOFT_TENANT_ID=common
# This allows ANY Microsoft user to sign up/login

# For Graph API in code, we use:
# VVIT_TENANT_ID=f6981b0a-3915-4628-be7e-368196415f8f
# This sends emails from @vvit.net domain
```

---

## 💻 OAuth 2.0 Implementation

### Step 1: Install Required Packages

```bash
npm install passport passport-microsoft
```

### Step 2: Environment Configuration

Add to `.env`:

```env
# Microsoft OAuth Configuration
MICROSOFT_CLIENT_ID=your_client_id_here
MICROSOFT_CLIENT_SECRET=your_client_secret_here
MICROSOFT_CALLBACK_URL=http://localhost:3000/auth/microsoft/callback
MICROSOFT_TENANT_ID=common

# For Graph API (email sending)
MICROSOFT_SENDER_EMAIL=your_email@vvit.net

# Frontend URL
CLIENT_URL=http://localhost:5173
```

### Step 3: Update User Model

Ensure `models/User.js` includes Microsoft fields:

```javascript
const mongoose = require('mongoose');

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
      return !this.googleId && !this.microsoftId;
    }
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  microsoftId: {
    type: String,
    sparse: true,
    unique: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
```

### Step 4: Configure Passport Microsoft Strategy

Update `config/passport.js`:

```javascript
const passport = require('passport');
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const User = require('../models/User');

// Microsoft OAuth Strategy
passport.use(new MicrosoftStrategy({
  clientID: process.env.MICROSOFT_CLIENT_ID,
  clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  callbackURL: process.env.MICROSOFT_CALLBACK_URL,
  scope: ['user.read'],
  tenant: process.env.MICROSOFT_TENANT_ID,
  authorizationURL: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize`,
  tokenURL: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/oauth2/v2.0/token`
},
async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('\n🔍 Microsoft Profile Received:');
    console.log('   ID:', profile.id);
    console.log('   Name:', profile.displayName);
    console.log('   Email:', profile.emails[0].value);
    
    // Check if user already exists with Microsoft ID
    let user = await User.findOne({ microsoftId: profile.id });
    
    if (user) {
      console.log('   ✅ Existing Microsoft user found');
      return done(null, user);
    }
    
    // Check if user exists with same email (from local/Google signup)
    const email = profile.emails[0].value.toLowerCase();
    user = await User.findOne({ email });
    
    if (user) {
      // Link Microsoft account to existing user and mark as verified
      console.log('   🔗 Linking Microsoft to existing user');
      user.microsoftId = profile.id;
      user.isVerified = true; // Auto-verify when linking OAuth account
      if (profile.photos && profile.photos[0]) {
        user.profilePicture = profile.photos[0].value; // Update profile picture
      }
      await user.save();
      return done(null, user);
    }
    
    // Create new user
    console.log('   🆕 Creating new Microsoft user');
    
    user = await User.create({
      microsoftId: profile.id,
      name: profile.displayName,
      email: email,
      profilePicture: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
      isVerified: true // Microsoft OAuth users are pre-verified by Microsoft
    });
      email: email,
      verified: false // Requires email verification even for Microsoft
    });
    
    console.log('   ✅ New Microsoft user created:', user._id);
    console.log('   📧 Verified:', user.isVerified);
    
    // Mark as new signup for welcome email
    user.isNewSignup = true;
    
    return done(null, user);
  } catch (error) {
    console.error('   ❌ Microsoft Strategy Error:', error);
    return done(error, null);
  }
}));

// Serialization (same for all strategies)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

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

// Microsoft OAuth - Initiate authentication
router.get('/microsoft',
  passport.authenticate('microsoft', {
    prompt: 'select_account' // Always show account selection
  })
);

// Microsoft OAuth - Callback handler
router.get('/microsoft/callback',
  passport.authenticate('microsoft', {
    failureRedirect: '/login',
    session: true
  }),
  async (req, res) => {
    try {
      console.log('\n🔄 Microsoft OAuth Callback - User Authentication:');
      console.log('   👤 User:', req.user.name);
      console.log('   📧 Email:', req.user.email);
      console.log('   🆔 Microsoft ID:', req.user.microsoftId);
      console.log('   ✅ Verified:', req.user.verified);
      console.log('   🆕 isNewSignup:', !!req.user.isNewSignup);
      
      // Handle new signups
      if (req.user.isNewSignup) {
        console.log('\n✅ NEW MICROSOFT SIGNUP DETECTED!');
        console.log('   Preparing to send welcome email...');
        
        // Wait before sending to avoid rate limits
        console.log('   ⏳ Waiting 2 seconds before sending email...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('   📤 Sending email now...');
        
        const welcomeEmail = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #0078d4 0%, #00b294 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; padding: 12px 30px; background: #0078d4; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
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
                <p>Thank you for joining the <strong>AIHub VVIT Community</strong> using your Microsoft account!</p>
                <p>Your account has been created successfully.</p>
                ${!req.user.verified ? '<p><strong>Please verify your email to access all features.</strong></p>' : ''}
                <p style="text-align: center;">
                  <a href="${process.env.CLIENT_URL}/dashboard" class="button">Go to Dashboard</a>
                </p>
                <h3>What's Next?</h3>
                <ul>
                  <li>✅ ${req.user.verified ? 'Your account is verified' : 'Verify your email address'}</li>
                  <li>✅ Complete your profile</li>
                  <li>✅ Explore AI resources</li>
                  <li>✅ Connect with fellow students</li>
                  <li>✅ Join community discussions</li>
                </ul>
              </div>
              <div class="footer">
                <p>© 2025 AIHub VVIT. All rights reserved.</p>
                <p>Vasireddy Venkatadri Institute of Technology</p>
              </div>
            </div>
          </body>
          </html>
        `;
        
        // Send welcome email using smart routing
        await sendEmail(
          req.user.email,
          '🎉 Welcome to AIHub Family – Registration Successful!',
          welcomeEmail
        );
        
        console.log('\n✅ SUCCESS! Welcome email delivered to:', req.user.email);
        console.log('   🔄 Redirecting user to dashboard...\n');
        
        // Clear the flag
        delete req.user.isNewSignup;
      }
      
      // Redirect based on verification status
      if (!req.user.verified) {
        res.redirect(`${process.env.CLIENT_URL}/verify-email?message=check_email`);
      } else {
        res.redirect(`${process.env.CLIENT_URL}/dashboard?login=success`);
      }
    } catch (error) {
      console.error('   ❌ Callback Error:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }
  }
);

module.exports = router;
```

---

## 📧 Microsoft Graph API Setup

### Step 1: Install Graph API Packages

```bash
npm install @microsoft/microsoft-graph-client @azure/identity isomorphic-fetch
```

### Step 2: Create Email Service

Create `services/emailService.js`:

```javascript
const { Client } = require('@microsoft/microsoft-graph-client');
const { ClientSecretCredential } = require('@azure/identity');
require('isomorphic-fetch');
const nodemailer = require('nodemailer');

// Detect if email is from Microsoft domain
function isMicrosoftEmail(email) {
  const microsoftDomains = [
    '@outlook.com',
    '@hotmail.com',
    '@live.com',
    '@msn.com',
    '@vvit.net',
    '@passport.com'
  ];
  
  return microsoftDomains.some(domain => 
    email.toLowerCase().includes(domain)
  );
}

// Send via Microsoft Graph API
async function sendViaGraphAPI(to, subject, html) {
  try {
    // Use VVIT tenant for organizational email sending
    const credential = new ClientSecretCredential(
      'f6981b0a-3915-4628-be7e-368196415f8f', // VVIT tenant ID
      process.env.MICROSOFT_CLIENT_ID,
      process.env.MICROSOFT_CLIENT_SECRET
    );

    const client = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => {
          const token = await credential.getToken(
            'https://graph.microsoft.com/.default'
          );
          return token.token;
        }
      }
    });

    const message = {
      message: {
        subject: subject,
        body: {
          contentType: 'HTML',
          content: html
        },
        toRecipients: [
          {
            emailAddress: {
              address: to
            }
          }
        ]
      },
      saveToSentItems: true
    };

    await client
      .api(`/users/${process.env.MICROSOFT_SENDER_EMAIL}/sendMail`)
      .post(message);
    
    console.log(`   ✅ Email sent successfully via Microsoft Graph API!`);
    console.log(`      Message ID: [Graph API - no ID returned]`);
  } catch (error) {
    console.log(`   ❌ Microsoft Graph API failed: ${error.message}`);
    
    if (error.message.includes('Access is denied')) {
      console.log(`   🔒 Permission Error: Mail.Send permission not granted in Azure`);
      console.log(`   📖 See AZURE_EMAIL_GUIDE.md for setup instructions`);
    }
    
    throw error;
  }
}

// Send via Gmail SMTP with retry logic
async function sendViaGmail(to, subject, html) {
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateDelta: 1000,
    rateLimit: 5
  });

  const mailOptions = {
    from: `AIHub VVIT <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    html: html
  };

  let lastError;
  
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`   📧 Attempt ${attempt}/3 via Gmail SMTP...`);
      const info = await transporter.sendMail(mailOptions);
      console.log(`   ✅ Email sent successfully via Gmail!`);
      console.log(`      Message ID: ${info.messageId}`);
      return info;
    } catch (error) {
      lastError = error;
      console.log(`   ❌ Attempt ${attempt} failed: ${error.message}`);
      
      if (attempt < 3) {
        const delay = 2000 * attempt;
        console.log(`   ⏳ Waiting ${delay/1000}s before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// Main email sending function with intelligent routing
async function sendEmail(to, subject, html) {
  console.log(`\n📧 Preparing to send email:`);
  console.log(`   To: ${to}`);
  console.log(`   Subject: ${subject}`);
  
  const isMicrosoft = isMicrosoftEmail(to);
  console.log(`   Domain Type: ${isMicrosoft ? '🟦 Microsoft/Outlook' : '🟩 Other'}`);
  
  // Rate limiting: wait 2 seconds
  console.log(`   ⏳ Waiting 2 seconds before sending...`);
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Try Microsoft Graph API for Microsoft domains
  if (isMicrosoft) {
    console.log(`   ✅ Using Microsoft Graph API (best for Microsoft domains)`);
    try {
      console.log(`   📬 Sending via Microsoft Graph API...`);
      await sendViaGraphAPI(to, subject, html);
      console.log(`✅ SUCCESS! Email delivered via Graph API to: ${to}\n`);
      return { success: true, provider: 'graph' };
    } catch (error) {
      console.log(`   ⚠️  Microsoft Graph failed, falling back to Gmail...`);
    }
  }
  
  // Fallback to Gmail
  console.log(`   📧 Sending via Gmail SMTP...`);
  await sendViaGmail(to, subject, html);
  console.log(`✅ SUCCESS! Email delivered via Gmail to: ${to}\n`);
  return { success: true, provider: 'gmail' };
}

// Initialize Graph API on server startup
function initializeGraphAPI() {
  console.log('\n📧 Email Service Configuration:');
  
  if (process.env.MICROSOFT_CLIENT_ID && 
      process.env.MICROSOFT_CLIENT_SECRET &&
      process.env.MICROSOFT_SENDER_EMAIL) {
    console.log('✅ Microsoft Graph API initialized successfully');
    console.log(`   Sender: ${process.env.MICROSOFT_SENDER_EMAIL}`);
  } else {
    console.log('⚠️  Microsoft Graph API not configured');
    console.log('   All emails will be sent via Gmail SMTP');
  }
  
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    console.log('✅ Gmail SMTP configured');
  }
  
  console.log('');
}

module.exports = {
  sendEmail,
  initializeGraphAPI
};
```

### Step 3: Initialize in Server

Update `server.js`:

```javascript
const { initializeGraphAPI } = require('./services/emailService');

// ... other server setup ...

// Initialize email services
initializeGraphAPI();

// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
```

---

## 🎨 Frontend Implementation

### Microsoft Sign-In Button

Update `src/pages/Login.jsx`:

```javascript
const Login = () => {
  const handleMicrosoftLogin = () => {
    window.location.href = 'http://localhost:3000/auth/microsoft';
  };

  return (
    <div className="login-container">
      <h2>Login to AIHub</h2>
      
      {/* Local login */}
      <form>...</form>
      
      <div className="divider"><span>OR</span></div>
      
      {/* Google button */}
      <button onClick={handleGoogleLogin} className="google-signin-btn">
        <img src="google-icon.svg" alt="Google" />
        Sign in with Google
      </button>
      
      {/* Microsoft button */}
      <button onClick={handleMicrosoftLogin} className="microsoft-signin-btn">
        <img src="microsoft-icon.svg" alt="Microsoft" />
        Sign in with Microsoft
      </button>
    </div>
  );
};
```

### Add CSS

```css
.microsoft-signin-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.microsoft-signin-btn:hover {
  background: #f8f9fa;
  border-color: #0078d4;
  box-shadow: 0 2px 8px rgba(0, 120, 212, 0.3);
}

.microsoft-signin-btn img {
  width: 20px;
  height: 20px;
}
```

---

## 🧪 Testing

### Test Checklist

**OAuth Authentication:**
- [ ] Sign up with @outlook.com account
- [ ] Sign up with @vvit.net account
- [ ] Sign up with @hotmail.com account
- [ ] Login with existing Microsoft account
- [ ] Link Microsoft to existing local account
- [ ] Session persistence after refresh

**Email Delivery:**
- [ ] Welcome email sent to @vvit.net via Graph API
- [ ] Welcome email sent to @outlook.com via Graph API
- [ ] Fallback to Gmail if Graph API fails
- [ ] Emails to non-Microsoft domains use Gmail
- [ ] No spam blocking issues

### Testing Script

```javascript
// Test user creation
const testUser = {
  name: 'Test Student',
  email: '23BQ1A5446@vvit.net', // VVIT email
  microsoftId: 'test-microsoft-id-12345'
};

// Verify in MongoDB
db.users.findOne({ email: '23bq1a5446@vvit.net' });

// Check email logs
// Should see: "✅ Email sent successfully via Microsoft Graph API!"
```

---

## 🐛 Troubleshooting

### Error: "AADSTS50020: User account from identity provider does not exist"

**Problem**: Tenant configured as single-tenant but external users trying to sign in

**Solution**:
```env
# Change to multi-tenant
MICROSOFT_TENANT_ID=common
```

### Error: "Access is denied" when sending email

**Problem**: Mail.Send permission not granted

**Solution**:
1. Go to Azure Portal → App registrations → Your app
2. API permissions → Mail.Send → Grant admin consent
3. Wait 5 minutes for propagation
4. Restart server

### Error: "The mailbox is either inactive, soft-deleted, or is hosted on-premise"

**Problem**: Sender email doesn't exist or isn't active in Microsoft 365

**Solution**:
```env
# Use an active organizational email
MICROSOFT_SENDER_EMAIL=active-user@vvit.net
```

### Emails not being delivered via Graph API

**Check logs:**
```
✅ Using Microsoft Graph API (best for Microsoft domains)
❌ Microsoft Graph API failed: [error message]
⚠️  Microsoft Graph failed, falling back to Gmail...
```

**Common causes:**
1. Mail.Send permission not granted → Grant in Azure Portal
2. Wrong tenant ID in credential → Use organization tenant, not "common"
3. Sender email doesn't exist → Use valid organizational email
4. Network/firewall blocking → Check network settings

---

## ✅ Best Practices

### Security

1. **Use organization tenant for Graph API**:
   ```javascript
   // CORRECT
   const credential = new ClientSecretCredential(
     'f6981b0a-3915-4628-be7e-368196415f8f', // Org tenant
     CLIENT_ID,
     SECRET
   );
   ```

2. **Separate OAuth and Graph API configs**:
   ```env
   # OAuth (multi-tenant)
   MICROSOFT_TENANT_ID=common
   
   # Graph API (in code, use org tenant)
   ```

3. **Validate email domains**:
   ```javascript
   const isVVITEmail = email.endsWith('@vvit.net');
   ```

### Performance

1. **Implement rate limiting**:
   ```javascript
   await new Promise(resolve => setTimeout(resolve, 2000));
   ```

2. **Use connection pooling**:
   ```javascript
   pool: true,
   maxConnections: 5
   ```

3. **Async email sending**:
   ```javascript
   // Don't await in critical path
   sendEmail(email, subject, html)
     .catch(err => console.error(err));
   ```

---

## 📚 Resources

- [Microsoft Identity Platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [Microsoft Graph API](https://docs.microsoft.com/en-us/graph/)
- [Passport Microsoft Strategy](http://www.passportjs.org/packages/passport-microsoft/)
- [Azure Portal](https://portal.azure.com/)

---

**Microsoft Authentication & Graph API successfully implemented! 🎉**

**Related Guides:**
- [Google Authentication](./GOOGLE_AUTHENTICATION.md)
- [Complete Challenges & Solutions](./CHALLENGES_AND_SOLUTIONS.md)
- [Project README](./README.md)
