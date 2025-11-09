# 🚀 AIHub - VVIT Student Community Platform# 🚀 AIHub - VVIT Authentication SystemGet started by customizing your environment (defined in the .idx/dev.nix file) with the tools and IDE extensions you'll need for your project!



## 📋 Overview



**AIHub** is a comprehensive web application designed for the AI student community at **Vasireddy Venkatadri Institute of Technology (VVIT)**. The platform provides secure user authentication, email verification, and seamless OAuth integration with Google and Microsoft accounts.> **Complete authentication platform for Vasireddy Venkatadri Institute of Technology's AI Hub**Learn more at https://developers.google.com/idx/guides/customize-idx-env



---[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)

## ✨ Features[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green.svg)](https://www.mongodb.com/)

[![Express](https://img.shields.io/badge/Express-4.18.2-lightgrey.svg)](https://expressjs.com/)

### 🔐 Authentication System

- **Local Authentication**: Email/Password signup and login**Project Status:** ✅ Production Ready  

- **Google OAuth 2.0**: Sign in with Google accounts**Version:** 1.0.0  

- **Microsoft OAuth 2.0**: Sign in with Microsoft/VVIT accounts**Last Updated:** October 21, 2025

- **Email Verification**: Secure email verification for new users

- **Password Recovery**: Forgot password and reset functionality---

- **Session Management**: Secure session handling with MongoDB store

## 📋 Table of Contents

### 📧 Smart Email System

- **Dual Provider Support**: Gmail SMTP and Microsoft Graph API- [Overview](#overview)

- **Intelligent Routing**: Automatically selects best email provider based on recipient domain- [Features](#features)

- **Retry Logic**: 3-attempt retry mechanism with exponential backoff- [Quick Start](#quick-start)

- **Fallback System**: Automatic fallback to Gmail if Graph API fails- [Installation](#installation)

- [Configuration](#configuration)

### 🎨 Modern Frontend- [API Endpoints](#api-endpoints)

- **React 18**: Modern component-based architecture- [Testing](#testing)

- **Vite**: Lightning-fast development and build tool- [Documentation](#documentation)

- **Responsive Design**: Mobile-friendly UI- [Troubleshooting](#troubleshooting)

- **Protected Routes**: Client-side route protection- [Support](#support)



------



## 🛠️ Tech Stack## 🎯 Overview



### BackendAIHub Authentication System is a full-stack web application providing secure user authentication and management for VVIT's AI Hub community.

- **Runtime**: Node.js

- **Framework**: Express.js 4.18.2### Key Highlights

- **Database**: MongoDB Atlas (Mongoose 6.13.8)

- **Authentication**: Passport.js (Local, Google, Microsoft strategies)- ✅ **Complete Authentication** - Email/Password + Google OAuth + Microsoft OAuth

- **Email Services**: - ✅ **Smart Email System** - Welcome emails for new signups only

  - Nodemailer 7.0.9 (Gmail SMTP)- ✅ **Beautiful UI/UX** - Animated success/error pages

  - Microsoft Graph Client 3.0.7 (Graph API)- ✅ **Professional Emails** - Branded HTML templates (optimized for light mode)

- **Session Store**: connect-mongo 5.1.0- ✅ **Robust Security** - Password hashing, JWT, sessions

- **Security**: bcryptjs, jsonwebtoken- ✅ **Clean Project Structure** - Essential files only



### Frontend---

- **Framework**: React 18.2.0

- **Build Tool**: Vite 5.0.8## ✨ Features

- **Routing**: React Router DOM

- **HTTP Client**: Axios### Authentication Methods



### Development Tools| Method | Description | Verification |

- **Process Manager**: Nodemon 3.0.2|--------|-------------|--------------|

- **Concurrent Tasks**: Concurrently 8.2.2| **Email/Password** | Traditional signup with email verification | ✅ Required |

- **Environment**: dotenv 16.3.1| **Google OAuth** | One-click signup/login with Google | ✅ Auto-verified |

| **Google OAuth** | One-click signup/login with Google | ✅ Pre-verified by Google |
| **Microsoft OAuth** | One-click signup/login with Microsoft account | ✅ Pre-verified by Microsoft |

---

### Smart Email Logic

| Action | Email Sent | Notes |
|--------|-----------|-------|
| Manual Signup | Verification + Welcome | 2 emails total (email verification required) |
| Google Signup (New) | Welcome only | 1 email (Google pre-verifies email) |
| Google Login (Existing) | None | 0 emails (returning user) |
| Microsoft Signup (New) | Welcome only | 1 email (Microsoft pre-verifies email) |
| Microsoft Login (Existing) | None | 0 emails (returning user) |
| Password Reset | Reset link | 1 email |

**Why OAuth users don't need verification emails:**
- Google and Microsoft already verify email ownership during OAuth
- These providers guarantee the email belongs to the user
- Additional verification would be redundant and harm user experience

---

### Smart Email Logic

## 📦 Installation

| Action | Email Sent | Notes |

### Prerequisites|--------|-----------|-------|

- **Node.js**: v16.x or higher| Manual Signup | Verification + Welcome | 2 emails total |

- **npm**: v8.x or higher| Google Signup (New) | Welcome only | 1 email (no verification needed) |

- **MongoDB Atlas**: Account with cluster setup| Google Login (Existing) | None | 0 emails (returning user) |

- **Google OAuth**: Client ID and Secret| Microsoft Signup (New) | Welcome only | 1 email (no verification needed) |

- **Microsoft OAuth**: Client ID and Secret| Microsoft Login (Existing) | None | 0 emails (returning user) |

- **Gmail**: App-specific password (for SMTP)| Password Reset | Reset link | 1 email |



### Step 1: Clone Repository### UI Features

```bash

git clone <repository-url>- ✅ Beautiful animated verification success page

cd aihub0909- ✅ Comprehensive error page with recovery options

```- ✅ Email validation with typo detection

- ✅ Responsive design (mobile/tablet/desktop)

### Step 2: Install Dependencies- ✅ Professional AIHUB-VVIT branding

```bash

# Install backend dependencies---

npm install

## 🚀 Quick Start

# Install frontend dependencies

cd client### Prerequisites

npm install

cd ..- Node.js 18+

```- MongoDB 6+

- Gmail account (for emails)

### Step 3: Environment Configuration- Google OAuth credentials

Create a `.env` file in the root directory:- Microsoft OAuth credentials (Azure Portal)



```env### Install & Run

# Server Configuration

PORT=3000```bash

NODE_ENV=development# Clone repository

SESSION_SECRET=your-super-secret-session-key-change-this-in-productiongit clone https://github.com/AIHUB-VVIT/aihub-authentication.git

cd aihub-authentication

# MongoDB Atlas

MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/aihub?retryWrites=true&w=majority# Install dependencies

npm install

# JWT Secretcd client && npm install && cd ..

JWT_SECRET=your-jwt-secret-key-for-password-reset-tokens

# Configure .env file (see Configuration section)

# Google OAuthcp .env.example .env

GOOGLE_CLIENT_ID=your-google-client-id

GOOGLE_CLIENT_SECRET=your-google-client-secret# Run application

GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callbacknpm run dev:all

```

# Microsoft OAuth

MICROSOFT_CLIENT_ID=your-microsoft-client-idAccess at:

MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret- **Frontend:** http://localhost:5173

MICROSOFT_CALLBACK_URL=http://localhost:3000/auth/microsoft/callback- **Backend:** http://localhost:3000

MICROSOFT_TENANT_ID=common

---

# Email Configuration - Gmail SMTP

EMAIL_USER=your-email@gmail.com## 🛠️ Installation

EMAIL_PASS=your-gmail-app-password

### Step 1: Install Dependencies

# Email Configuration - Microsoft Graph API (Optional)

MICROSOFT_SENDER_EMAIL=your-email@vvit.net```bash

# Backend

# Frontend URLnpm install

CLIENT_URL=http://localhost:5173

```# Frontend

cd client

### Step 4: Run Applicationnpm install

cd ..

#### Development Mode (Both servers)```

```bash

npm run dev:all### Step 2: Configure Environment

```

Create `.env` file in root directory:

#### Development Mode (Separate terminals)

```bash```env

# Terminal 1 - Backend# Server

npm run devPORT=3000

NODE_ENV=development

# Terminal 2 - Frontend

npm run client# MongoDB

```MONGODB_URI=mongodb://localhost:27017/aihub



#### Production Mode# Secrets (generate random strings)

```bashSESSION_SECRET=your-session-secret

# Build frontendJWT_SECRET=your-jwt-secret

npm run client:build

# Email (Gmail)

# Start backendEMAIL_USER=your-email@gmail.com

npm startEMAIL_PASS=your-gmail-app-password

```

# Google OAuth

---GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

GOOGLE_CLIENT_SECRET=your-client-secret

## 🌐 Access URLs

# Microsoft OAuth

- **Frontend**: http://localhost:5173MICROSOFT_CLIENT_ID=your-microsoft-client-id

- **Backend API**: http://localhost:3000MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret

- **MongoDB Atlas**: Dashboard at cloud.mongodb.comMICROSOFT_TENANT_ID=common

MICROSOFT_CALLBACK_URL=http://localhost:3000/auth/microsoft/callback

---```



## 📁 Project Structure### Step 3: Set Up Gmail App Password



```1. Go to [Google Account Security](https://myaccount.google.com/security)

aihub0909/2. Enable **2-Step Verification**

├── server.js                    # Express server entry point3. Go to **App passwords**

├── package.json                 # Backend dependencies4. Generate password for "Mail"

├── .env                         # Environment variables5. Copy to `.env` as `EMAIL_PASS`

├── Dockerfile                   # Docker configuration

├── docker-compose.yml           # Docker Compose setup### Step 4: Set Up Google OAuth

│

├── config/1. Go to [Google Cloud Console](https://console.cloud.google.com/)

│   └── passport.js              # Passport strategies configuration2. Create project

│3. Enable Google+ API

├── middleware/4. Create OAuth 2.0 credentials

│   └── isVerified.js            # Email verification middleware5. Add redirect URI: `http://localhost:3000/auth/google/callback`

│6. Copy Client ID and Secret to `.env`

├── models/

│   └── User.js                  # MongoDB User schema### Step 5: Set Up Microsoft OAuth

│

├── routes/1. Go to [Azure Portal](https://portal.azure.com/)

│   ├── auth.js                  # Authentication routes2. Navigate to **Azure Active Directory** → **App registrations**

│   └── api.js                   # Protected API routes3. Create **New registration**

│   - Name: AIHub Authentication

├── services/   - Supported account types: **Accounts in any organizational directory and personal Microsoft accounts**

│   └── emailService.js          # Smart email routing service4. Add redirect URI: `http://localhost:3000/auth/microsoft/callback`

│5. Go to **Certificates & secrets** → Create **New client secret**

└── client/                      # React frontend6. Copy **Application (client) ID** as `MICROSOFT_CLIENT_ID`

    ├── package.json             # Frontend dependencies7. Copy **Client secret VALUE** (not ID) as `MICROSOFT_CLIENT_SECRET`

    ├── vite.config.js           # Vite configuration8. Use `common` as `MICROSOFT_TENANT_ID` to support all account types

    ├── index.html               # HTML entry point

    │---

    ├── src/

    │   ├── main.jsx             # React entry point## ⚙️ Configuration

    │   ├── App.jsx              # Root component

    │   │### Environment Variables

    │   ├── components/

    │   │   ├── Header.jsx       # Navigation header| Variable | Description | Required | Example |

    │   │   ├── Footer.jsx       # Footer component|----------|-------------|----------|---------|

    │   │   └── PrivateRoute.jsx # Protected route wrapper| `PORT` | Server port | Yes | `3000` |

    │   │| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb://localhost:27017/aihub` |

    │   ├── pages/| `SESSION_SECRET` | Express session secret | Yes | Random 64-char string |

    │   │   ├── Home.jsx         # Landing page| `JWT_SECRET` | JWT signing secret | Yes | Random 64-char string |

    │   │   ├── Login.jsx        # Login page| `EMAIL_USER` | Gmail address | Yes | `aihub.vvit@gmail.com` |

    │   │   ├── Signup.jsx       # Signup page| `EMAIL_PASS` | Gmail app password | Yes | 16-char app password |

    │   │   ├── VerifyEmail.jsx  # Email verification page| `GOOGLE_CLIENT_ID` | OAuth client ID | Yes | From Google Cloud Console |

    │   │   ├── ForgotPassword.jsx    # Password recovery| `GOOGLE_CLIENT_SECRET` | OAuth client secret | Yes | From Google Cloud Console |

    │   │   └── ResetPassword.jsx     # Password reset| `MICROSOFT_CLIENT_ID` | Azure app client ID | Yes | From Azure Portal |

    │   │| `MICROSOFT_CLIENT_SECRET` | Azure app client secret | Yes | From Azure Portal |

    │   ├── context/| `MICROSOFT_TENANT_ID` | Azure tenant ID | Yes | Use `common` for all accounts |

    │   │   └── AuthContext.jsx  # Authentication context| `MICROSOFT_CALLBACK_URL` | OAuth callback URL | Yes | `http://localhost:3000/auth/microsoft/callback` |

    │   │

    │   ├── services/### Generate Secrets

    │   │   └── authService.js   # API service layer

    │   │```bash

    │   └── styles/# Using Node.js

    │       ├── index.css        # Global stylesnode -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

    │       ├── components.css   # Component styles

    │       └── pages.css        # Page styles# Using OpenSSL

    │openssl rand -hex 64

    └── public/                  # Static assets```

```

---

---

## 📡 API Endpoints

## 🔑 API Endpoints

### Authentication

### Authentication Routes (`/auth`)

| Method | Endpoint | Description | Auth |

| Method | Endpoint | Description | Auth Required ||--------|----------|-------------|------|

|--------|----------|-------------|---------------|| `POST` | `/auth/signup` | Register new user | No |

| POST | `/auth/signup` | Register new user | No || `POST` | `/auth/login` | Login user | No |

| POST | `/auth/login` | Login with email/password | No || `GET` | `/auth/logout` | Logout user | Yes |

| GET | `/auth/logout` | Logout current user | Yes || `GET` | `/auth/user` | Get current user | Yes |

| GET | `/auth/verify-email/:token` | Verify email address | No || `POST` | `/auth/forgot-password` | Request password reset | No |

| POST | `/auth/forgot-password` | Request password reset | No || `POST` | `/auth/reset-password/:token` | Reset password | No |

| POST | `/auth/reset-password/:token` | Reset password | No || `GET` | `/auth/verify-email/:token` | Verify email | No |

| GET | `/auth/google` | Initiate Google OAuth | No |

| GET | `/auth/google/callback` | Google OAuth callback | No |### OAuth Providers

| GET | `/auth/microsoft` | Initiate Microsoft OAuth | No |

| GET | `/auth/microsoft/callback` | Microsoft OAuth callback | No || Method | Endpoint | Description |

|--------|----------|-------------|

### Protected API Routes (`/api`)| `GET` | `/auth/google` | Initiate Google OAuth |

| `GET` | `/auth/google/callback` | Google OAuth callback |

| Method | Endpoint | Description | Auth Required || `GET` | `/auth/microsoft` | Initiate Microsoft OAuth |

|--------|----------|-------------|---------------|| `GET` | `/auth/microsoft/callback` | Microsoft OAuth callback |

| GET | `/api/user` | Get current user info | Yes |

| GET | `/api/dashboard` | Get dashboard data | Yes |---



---## 🧪 Testing



## 🔒 Security Features### Run Tests



- **Password Hashing**: bcrypt with salt rounds```bash

- **JWT Tokens**: Secure password reset tokens with expirationnpm test

- **Session Security**: HTTP-only cookies with secure session store```

- **Email Verification**: Mandatory email verification for new signups

- **CORS Protection**: Configured for frontend origin only### Manual Testing Guide

- **Environment Variables**: Sensitive data stored securely in .env

See **[USER_WORKFLOWS.md](USER_WORKFLOWS.md)** for 25+ comprehensive test cases.

---

### Quick Test Flow

## 📧 Email System Architecture

```bash

### Smart Routing Logic# 1. Manual Signup

```→ Sign up with email

User Signup/Login→ Verify email (check inbox)

    ↓→ Receive welcome email

Email Service Detects Domain→ Login

    ↓

    ├─→ Microsoft Domain (@outlook.com, @hotmail.com, @vvit.net)# 2. Google Signup (New User)

    │       ↓→ Sign up with Google

    │   Try Microsoft Graph API→ Receive welcome email

    │       ↓→ Already logged in

    │   Success? → Send via Graph API ✅

    │       ↓# 3. Google Login (Existing User)

    │   Failed? → Fallback to Gmail SMTP 🔄→ Login with Google

    │→ NO email sent

    └─→ Other Domains (@gmail.com, etc.)→ Already logged in

            ↓

        Send via Gmail SMTP ✅# 4. Microsoft Signup (New User)

```→ Sign up with Microsoft

→ Receive welcome email

### Retry Mechanism→ Already logged in

- **Attempts**: 3 retries with exponential backoff

- **Delays**: 2s, 4s, 8s between retries# 5. Microsoft Login (Existing User)

- **Fallback**: Automatic provider switching on failure→ Login with Microsoft

→ NO email sent

---→ Already logged in

```

## 🚀 Deployment

### Expected Console Output

### Environment Variables for Production

Update `.env` with production values:**New Google Signup:**

- Change `NODE_ENV` to `production````

- Use production MongoDB URI🔍 Google OAuth - User Type: NEW SIGNUP

- Update `CLIENT_URL` to production domain📧 Email will be sent: YES

- Use production OAuth callback URLs🔄 Google Callback - isNewSignup flag: true

- Generate strong `SESSION_SECRET` and `JWT_SECRET`✅ NEW GOOGLE SIGNUP DETECTED - Sending welcome email...

✅ Welcome email sent successfully

### Build Commands```

```bash

# Build frontend for production**Existing Google Login:**

npm run client:build```

🔍 Google OAuth - User Type: EXISTING LOGIN

# Start production server📧 Email will be sent: NO

npm start🔄 Google Callback - isNewSignup flag: false

```ℹ️ EXISTING GOOGLE USER LOGIN - No email sent

```

### Docker Deployment

```bash**New Microsoft Signup:**

# Build and run with Docker Compose```

docker-compose up --build🔍 Microsoft OAuth - User Type: NEW SIGNUP

```📧 Email will be sent: YES

🔄 Microsoft Callback - isNewMicrosoftSignup flag: true

---✅ NEW MICROSOFT SIGNUP DETECTED - Sending welcome email...

✅ Welcome email sent successfully

## 📚 Documentation```



- **[Google Authentication Guide](./GOOGLE_AUTHENTICATION.md)** - Complete Google OAuth setup**Existing Microsoft Login:**

- **[Microsoft Authentication Guide](./MICROSOFT_AUTHENTICATION.md)** - Complete Microsoft OAuth setup```

- **[Project Workflow Flowchart](./PROJECT_FLOWCHART.md)** - Visual workflow diagram🔍 Microsoft OAuth - User Type: EXISTING LOGIN

- **[Challenges & Solutions](./CHALLENGES_AND_SOLUTIONS.md)** - Development journey📧 Email will be sent: NO

🔄 Microsoft Callback - isNewMicrosoftSignup flag: false

---ℹ️ EXISTING MICROSOFT USER LOGIN - No email sent

```

## 🤝 Contributing

---

1. Fork the repository

2. Create a feature branch (`git checkout -b feature/AmazingFeature`)## 📚 Documentation

3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)

4. Push to the branch (`git push origin feature/AmazingFeature`)### Core Documents

5. Open a Pull Request

| Document | Description | Lines |

---|----------|-------------|-------|

| **[README.md](README.md)** | Project overview, setup, API docs | This file |

## 📄 License| **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** | Complete project documentation | 1000+ |

| **[USER_WORKFLOWS.md](USER_WORKFLOWS.md)** | Complete test case documentation | 1000+ |

This project is licensed under the ISC License.| **[PROJECT_AUDIT_REPORT.md](PROJECT_AUDIT_REPORT.md)** | Recent audit results and cleanup | 500+ |



---### Project Structure



## 👥 Authors```

aihub0909/

**AIHub Development Team**  ├── client/              # React frontend

Vasireddy Venkatadri Institute of Technology (VVIT)│   ├── src/

│   │   ├── pages/      # UI pages (Login, Signup, etc.)

---│   │   ├── context/    # Auth state management

│   │   └── services/   # API calls

## 📞 Support├── config/              # Passport strategies

├── models/              # Mongoose schemas

For issues and questions:├── routes/              # Express routes

- Create an issue in the repository├── server.js            # Entry point

- Contact the development team└── .env                 # Environment variables

- Check the documentation files```



------



## 🙏 Acknowledgments## 🐛 Troubleshooting



- VVIT AI Community### Emails Not Sending

- Google Cloud Platform (OAuth Services)

- Microsoft Azure (Entra ID & Graph API)**Check:**

- MongoDB Atlas- `.env` has correct `EMAIL_USER` and `EMAIL_PASS`

- All open-source contributors- Using Gmail **App Password** (not regular password)

- Server console for SMTP errors

---

**Fix:**

**Made with ❤️ for the VVIT AI Community**```bash

# Verify email config
echo $EMAIL_USER
echo $EMAIL_PASS
```

### Google OAuth Fails

**Check:**
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
- Redirect URI: `http://localhost:3000/auth/google/callback`
- Authorized JavaScript origins include: `http://localhost:5173`

**Fix:**
1. Go to Google Cloud Console
2. Update OAuth credentials
3. Add correct redirect URIs

### Microsoft OAuth Fails

**Check:**
- `MICROSOFT_CLIENT_ID` and `MICROSOFT_CLIENT_SECRET` in `.env`
- Using client secret **VALUE** (not ID) from Azure Portal
- `MICROSOFT_TENANT_ID` is set to `common` (for all account types)
- Redirect URI: `http://localhost:3000/auth/microsoft/callback`

**Fix:**
1. Go to Azure Portal → App registrations
2. Regenerate client secret (copy VALUE not ID)
3. Ensure tenant ID is `common` for personal + organizational accounts
4. Add correct redirect URI

### Session Not Persisting

**Check:**
- `SESSION_SECRET` in `.env`
- MongoDB is running
- Browser accepts cookies
- CORS configured correctly

**Fix:**
```javascript
// server.js
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Welcome Email Not Sent for Google Signup

✅ **Already Fixed!** If still having issues:

**Check console logs:**
```
isNewSignup flag: true    ← Should be TRUE, not undefined
✅ Welcome email sent successfully
```

If shows `undefined`, restart server.

---

## 📞 Support

### Get Help

- **Email:** aihub.vvit@gmail.com
- **Website:** [https://aihub-vvitu.social](https://aihub-vvitu.social)
- **GitHub:** [https://github.com/AIHUB-VVIT](https://github.com/AIHUB-VVIT)
- **GitHub Pages:** [https://aihub-vvit.github.io](https://aihub-vvit.github.io)

### Report Issues

[Create an issue on GitHub](https://github.com/AIHUB-VVIT/aihub-authentication/issues)

---

## 🌟 Features Summary

- ✅ Email/Password Authentication
- ✅ Google OAuth Integration
- ✅ Microsoft OAuth Integration
- ✅ Email Verification (24h expiry)
- ✅ Password Reset Flow
- ✅ Smart Welcome Emails (light mode optimized)
- ✅ Email Typo Detection
- ✅ Beautiful Success/Error Pages
- ✅ Session Management
- ✅ Security (bcrypt, JWT, CORS)
- ✅ Comprehensive Documentation
- ✅ Clean Project Structure
- ✅ Production Ready

---

## 🎓 AIHub - VVIT

**Vasireddy Venkatadri Institute of Technology**  
**Empowering Innovation Through Artificial Intelligence**

### Connect With Us

- 🌐 **Website:** https://aihub-vvitu.social
- 📧 **Email:** aihub.vvit@gmail.com
- 💻 **GitHub:** https://github.com/AIHUB-VVIT
- 📖 **Pages:** https://aihub-vvit.github.io

---

**Made with ❤️ by AIHub - VVIT**  
**© 2025 AIHub - VVIT. All rights reserved.**

*Last Updated: October 21, 2025 | Version: 1.5.0 | Status: ✅ Production Ready*
