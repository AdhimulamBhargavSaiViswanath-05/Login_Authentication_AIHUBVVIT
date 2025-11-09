# 🔄 AIHub - Complete Project Workflow

## 📊 System Architecture Flowchart

```
┌─────────────────────────────────────────────────────────────┐
│                    AIHub Application                         │
│                    (VVIT Platform)                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │      User Access Points           │
        ├───────────────────────────────────┤
        │  • http://localhost:5173 (Dev)    │
        │  • React Frontend (Vite)          │
        │  • Responsive UI                  │
        └───────────────────────────────────┘
                            │
        ┌───────────────────┴──────────────────┐
        │                                       │
        ▼                                       ▼
┌──────────────┐                       ┌──────────────┐
│ New User     │                       │ Existing User│
│ Landing Page │                       │ Login Page   │
└──────────────┘                       └──────────────┘
        │                                       │
        └───────────┬───────────────────────────┘
                    ▼
        ┌───────────────────────┐
        │  Authentication Choice │
        └───────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│  Local   │ │  Google  │ │Microsoft │
│  Signup  │ │  OAuth   │ │  OAuth   │
│  (Email) │ │  2.0     │ │  2.0     │
└──────────┘ └──────────┘ └──────────┘
```

---

## 🔐 Authentication Flow

### 1. Local Email/Password Authentication

```
┌────────────────────────────────────────────────────────────┐
│                    Local Signup Flow                       │
└────────────────────────────────────────────────────────────┘

User enters credentials (name, email, password)
            │
            ▼
Frontend validates input (React form validation)
            │
            ▼
POST /auth/signup → Express Server
            │
            ▼
┌───────────────────────────────────────┐
│    Backend Validation                 │
│  • Email format check                 │
│  • Password strength check            │
│  • Check if user already exists       │
└───────────────────────────────────────┘
            │
            ▼
Password hashing (bcryptjs - 10 salt rounds)
            │
            ▼
Create User in MongoDB
            │
    ┌───────┴───────┐
    │  User Model   │
    │  • name       │
    │  • email      │
    │  • password   │
    │  • verified   │
    │  • createdAt  │
    └───────────────┘
            │
            ▼
Generate verification token (JWT - 24h expiry)
            │
            ▼
┌───────────────────────────────────────┐
│      Email Service Router             │
│  Detects recipient domain             │
└───────────────────────────────────────┘
            │
    ┌───────┴────────┐
    │                │
    ▼                ▼
Microsoft Domain   Other Domain
(@outlook.com,     (@gmail.com,
 @hotmail.com,     other domains)
 @vvit.net)        
    │                │
    ▼                ▼
Graph API          Gmail SMTP
(if configured)    (always works)
    │                │
    └────────┬───────┘
             ▼
Send verification email with link
            │
            ▼
User receives email → clicks verification link
            │
            ▼
GET /auth/verify-email/:token
            │
            ▼
Verify JWT token validity
            │
    ┌───────┴────────┐
    │ Valid?         │
    ▼                ▼
  YES               NO
    │                │
    ▼                ▼
Update User      Show error
verified=true    (expired/invalid)
    │
    ▼
Send welcome email
    │
    ▼
Redirect to login
    │
    ▼
User logs in with email/password
    │
    ▼
POST /auth/login → Passport Local Strategy
    │
    ▼
Validate credentials (bcrypt.compare)
    │
    ▼
Check if email is verified
    │
    ▼
Create session (express-session + MongoStore)
    │
    ▼
Return user data to frontend
    │
    ▼
Store in AuthContext (React Context API)
    │
    ▼
┌────────────────────┐
│  User Dashboard    │
│  (Protected Route) │
└────────────────────┘
```

### 2. Google OAuth 2.0 Flow

```
┌────────────────────────────────────────────────────────────┐
│                  Google OAuth Flow                         │
└────────────────────────────────────────────────────────────┘

User clicks "Sign in with Google"
            │
            ▼
GET /auth/google
            │
            ▼
Redirect to Google OAuth consent screen
            │
            ▼
User selects Google account & grants permissions
            │
            ▼
Google redirects to: /auth/google/callback?code=xxx
            │
            ▼
┌───────────────────────────────────────┐
│   Passport Google Strategy            │
│   • Exchanges code for access token   │
│   • Fetches user profile from Google  │
└───────────────────────────────────────┘
            │
            ▼
Check if user exists in MongoDB
            │
    ┌───────┴────────┐
    │ Exists?        │
    ▼                ▼
  YES               NO
    │                │
    ▼                ▼
Get existing    Create new user
user            │
                ▼
                Set verified=true (auto-verified)
                │
                ▼
                Send welcome email
                │
    ┌───────────┴────────┐
    │                    │
    ▼                    ▼
Create session    Log signup event
    │
    ▼
Redirect to frontend with user data
    │
    ▼
┌────────────────────┐
│  User Dashboard    │
└────────────────────┘
```

### 3. Microsoft OAuth 2.0 Flow

```
┌────────────────────────────────────────────────────────────┐
│               Microsoft OAuth Flow                         │
└────────────────────────────────────────────────────────────┘

User clicks "Sign in with Microsoft"
            │
            ▼
GET /auth/microsoft
            │
            ▼
Redirect to Microsoft login.microsoftonline.com
            │
            ▼
User enters Microsoft/VVIT credentials
            │
            ▼
Microsoft redirects to: /auth/microsoft/callback?code=xxx
            │
            ▼
┌───────────────────────────────────────┐
│   Passport Microsoft Strategy         │
│   • Exchanges code for access token   │
│   • Fetches user profile              │
│   • Gets email, displayName           │
└───────────────────────────────────────┘
            │
            ▼
Check if user exists in MongoDB
            │
    ┌───────┴────────┐
    │ Exists?        │
    ▼                ▼
  YES               NO (NEW SIGNUP)
    │                │
    ▼                ▼
Get existing    Create new user
user            │
│               ▼
│               Set verified=false (requires verification)
│               │
│               ▼
│               Send verification email
│               │
│               ▼
│               Email Service Router detects @vvit.net
│               │
│               ▼
│               Try Microsoft Graph API first
│               │
│           ┌───┴────┐
│           │Success?│
│           ▼        ▼
│          YES      NO
│           │        │
│           │        ▼
│           │    Fallback to Gmail SMTP
│           │        │
│           └────┬───┘
│                │
    ┌───────────┴────────┐
    │                    │
    ▼                    ▼
Create session    Log signup event
    │
    ▼
Redirect to frontend
    │
    ▼
┌────────────────────┐
│  User Dashboard    │
│  (if verified)     │
│        OR          │
│  Verification Page │
│  (if not verified) │
└────────────────────┘
```

---

## 📧 Email Service Flow

```
┌────────────────────────────────────────────────────────────┐
│           Smart Email Routing System                       │
└────────────────────────────────────────────────────────────┘

Email sending request initiated
            │
            ▼
services/emailService.js → sendEmail(to, subject, html)
            │
            ▼
┌───────────────────────────────────────┐
│    Domain Detection                   │
│    isMicrosoftEmail(email)            │
└───────────────────────────────────────┘
            │
            ▼
Check recipient email domain
            │
    ┌───────┴────────┐
    │                │
    ▼                ▼
Microsoft Domain   Other Domain
            │                │
            ▼                ▼
┌──────────────────┐  ┌──────────────────┐
│ Microsoft Domains│  │  Other Domains   │
│  • @outlook.com  │  │  • @gmail.com    │
│  • @hotmail.com  │  │  • @yahoo.com    │
│  • @live.com     │  │  • Custom domains│
│  • @msn.com      │  │                  │
│  • @vvit.net     │  │                  │
└──────────────────┘  └──────────────────┘
            │                │
            ▼                ▼
┌──────────────────┐  ┌──────────────────┐
│ sendViaGraphAPI()│  │ sendViaGmail()   │
└──────────────────┘  └──────────────────┘
            │                │
            ▼                │
Check if Graph API           │
is configured                │
            │                │
    ┌───────┴────────┐       │
    │ Configured?    │       │
    ▼                ▼       │
  YES               NO       │
    │                │       │
    ▼                └───┬───┘
Try Microsoft            │
Graph API                │
    │                    │
┌───┴────┐               │
│Success?│               │
▼        ▼               │
YES     NO               │
│        │               │
│        ▼               │
│    Log error          │
│        │               │
│        ▼               │
│    Fallback to        │
│    Gmail SMTP         │
│        │               │
└────┬───┴───────────────┘
     │
     ▼
┌──────────────────┐
│ sendViaGmail()   │
│  Retry Logic:    │
│  • Attempt 1     │
│    Wait 2s       │
│  • Attempt 2     │
│    Wait 4s       │
│  • Attempt 3     │
│    Wait 8s       │
└──────────────────┘
     │
┌────┴─────┐
│Success?  │
▼          ▼
YES       NO
│          │
│          ▼
│      Throw Error
│          │
└────┬─────┘
     │
     ▼
✅ Email Sent Successfully
     │
     ▼
Log success message
     │
     ▼
Return { success: true }
```

---

## 🔄 Password Reset Flow

```
┌────────────────────────────────────────────────────────────┐
│              Password Reset Workflow                       │
└────────────────────────────────────────────────────────────┘

User clicks "Forgot Password?"
            │
            ▼
Enter email address in form
            │
            ▼
POST /auth/forgot-password
            │
            ▼
Check if user exists with that email
            │
    ┌───────┴────────┐
    │ Exists?        │
    ▼                ▼
  YES               NO
    │                │
    ▼                ▼
Generate reset    Return success
token (JWT)       (security: don't
1 hour expiry     reveal if email
    │             exists)
    ▼
Store token in user document
    │
    ▼
Send password reset email with token link
    │
    ▼
User clicks reset link → /reset-password/:token
            │
            ▼
Frontend displays reset password form
            │
            ▼
User enters new password + confirmation
            │
            ▼
POST /auth/reset-password/:token
            │
            ▼
Verify JWT token validity
            │
    ┌───────┴────────┐
    │ Valid?         │
    ▼                ▼
  YES               NO
    │                │
    ▼                ▼
Hash new          Show error
password          (expired/invalid)
    │
    ▼
Update user password in MongoDB
    │
    ▼
Clear reset token
    │
    ▼
Send confirmation email
    │
    ▼
Redirect to login page
    │
    ▼
User logs in with new password
```

---

## 🛡️ Session Management Flow

```
┌────────────────────────────────────────────────────────────┐
│              Session Lifecycle                             │
└────────────────────────────────────────────────────────────┘

User successfully authenticates
            │
            ▼
┌───────────────────────────────────────┐
│   express-session Middleware          │
│   • Creates unique session ID         │
│   • Stores in MongoDB (MongoStore)    │
│   • Sets HTTP-only cookie             │
└───────────────────────────────────────┘
            │
            ▼
Session data stored in MongoDB sessions collection
            │
            ▼
Cookie sent to client browser
            │
            ▼
┌────────────────────┐
│  Subsequent        │
│  Requests          │
└────────────────────┘
            │
            ▼
Browser automatically sends session cookie
            │
            ▼
Express server receives request
            │
            ▼
express-session middleware
            │
            ▼
Looks up session in MongoDB by session ID
            │
    ┌───────┴────────┐
    │ Valid Session? │
    ▼                ▼
  YES               NO
    │                │
    ▼                ▼
Attach req.user   req.user = null
    │                │
    ▼                ▼
Continue to      Return 401
route handler    Unauthorized
    │
    ▼
┌────────────────────┐
│  Protected Route   │
│  Access Granted    │
└────────────────────┘
            │
            ▼
User interacts with application
            │
    ┌───────┴────────┐
    │                │
    ▼                ▼
User clicks      Session expires
"Logout"         (inactivity)
    │                │
    ▼                ▼
GET /auth/logout  Auto redirect
    │             to login
    ▼
Destroy session in MongoDB
    │
    ▼
Clear cookie
    │
    ▼
Redirect to home page
```

---

## 🗄️ Database Schema Flow

```
┌────────────────────────────────────────────────────────────┐
│           MongoDB Collections Structure                    │
└────────────────────────────────────────────────────────────┘

MongoDB Atlas Cluster
            │
            ▼
    Database: aihub
            │
    ┌───────┴────────┐
    │                │
    ▼                ▼
┌─────────┐    ┌─────────┐
│  users  │    │sessions │
└─────────┘    └─────────┘

┌────────────────────────────────────────────────────────────┐
│  users Collection (User Model)                             │
├────────────────────────────────────────────────────────────┤
│  {                                                         │
│    _id: ObjectId                                           │
│    name: String (required)                                 │
│    email: String (required, unique, lowercase)             │
│    password: String (hashed, not required for OAuth)       │
│    googleId: String (optional, for Google OAuth)           │
│    microsoftId: String (optional, for Microsoft OAuth)     │
│    verified: Boolean (default: false)                      │
│    verificationToken: String (optional, JWT)               │
│    resetPasswordToken: String (optional, JWT)              │
│    resetPasswordExpires: Date (optional)                   │
│    createdAt: Date (auto)                                  │
│    updatedAt: Date (auto)                                  │
│  }                                                         │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  sessions Collection (MongoStore)                          │
├────────────────────────────────────────────────────────────┤
│  {                                                         │
│    _id: String (session ID)                                │
│    expires: Date                                           │
│    session: {                                              │
│      cookie: {                                             │
│        originalMaxAge: Number                              │
│        httpOnly: true                                      │
│        secure: false (dev) / true (prod)                   │
│      },                                                    │
│      passport: {                                           │
│        user: userId (reference to users._id)               │
│      }                                                     │
│    }                                                       │
│  }                                                         │
└────────────────────────────────────────────────────────────┘
```

---

## 🚦 Request/Response Cycle

```
┌────────────────────────────────────────────────────────────┐
│           Complete Request/Response Flow                   │
└────────────────────────────────────────────────────────────┘

Client (React Frontend)
            │
            ▼
User action (button click, form submit)
            │
            ▼
API call via authService.js (Axios)
            │
            ▼
HTTP Request → http://localhost:3000
            │
            ▼
┌───────────────────────────────────────┐
│    Express Server (server.js)         │
└───────────────────────────────────────┘
            │
            ▼
CORS Middleware (allows localhost:5173/5174)
            │
            ▼
Body Parser (express.json())
            │
            ▼
Session Middleware (express-session)
            │
            ▼
Passport Initialize & Session
            │
            ▼
Route Matching
            │
    ┌───────┴────────┐
    │                │
    ▼                ▼
/auth Routes     /api Routes
(auth.js)        (api.js)
    │                │
    │                ▼
    │        ┌──────────────┐
    │        │ isVerified   │
    │        │ Middleware   │
    │        └──────────────┘
    │                │
    │        ┌───────┴────────┐
    │        │ Authenticated? │
    │        ▼                ▼
    │       YES              NO
    │        │                │
    │        ▼                ▼
    │    Continue         Return 401
    │        │
    └────┬───┘
         │
         ▼
Route Handler Function
         │
         ▼
Business Logic Execution
         │
    ┌────┴────┐
    │         │
    ▼         ▼
MongoDB    Email Service
Query      (if needed)
    │         │
    └────┬────┘
         │
         ▼
Prepare Response Data
         │
         ▼
res.json({ success, data, message })
         │
         ▼
Response sent to client
         │
         ▼
Axios receives response
         │
         ▼
Update React State (AuthContext)
         │
         ▼
UI Re-renders
         │
         ▼
User sees updated interface
```

---

## 🔄 Complete User Journey

```
┌────────────────────────────────────────────────────────────┐
│        End-to-End User Experience Flow                    │
└────────────────────────────────────────────────────────────┘

1. User visits http://localhost:5173
            │
            ▼
2. Lands on Home page (Header with Login/Signup buttons)
            │
    ┌───────┴────────┐
    │                │
    ▼                ▼
3a. Clicks       3b. Clicks
   "Login"          "Sign Up"
    │                │
    ▼                ▼
4a. Login Page   4b. Signup Page
    │                │
    │                ▼
    │            5. Fills form
    │                │
    │                ▼
    │            6. Submits → Backend creates user
    │                │
    │                ▼
    │            7. Verification email sent
    │                │
    │                ▼
    │            8. User checks email
    │                │
    │                ▼
    │            9. Clicks verification link
    │                │
    │                ▼
    │            10. Account verified ✅
    │                │
    └────────┬───────┘
             │
             ▼
11. User logs in (email/password or OAuth)
             │
             ▼
12. Authentication successful
             │
             ▼
13. Session created & stored in MongoDB
             │
             ▼
14. Redirect to Dashboard (Protected Route)
             │
             ▼
15. Dashboard loads user data
             │
             ▼
16. User interacts with platform features
             │
             ▼
17. All subsequent requests include session cookie
             │
             ▼
18. Backend verifies session on each request
             │
             ▼
19. User can access protected routes
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
20a. Continue    20b. Click Logout
    using app         │
    │                 ▼
    │             21. Session destroyed
    │                 │
    │                 ▼
    │             22. Redirect to Home
    │                 │
    └─────────────────┘
```

---

## 🎯 Error Handling Flow

```
┌────────────────────────────────────────────────────────────┐
│              Error Handling Workflow                       │
└────────────────────────────────────────────────────────────┘

Error occurs at any point in the system
            │
    ┌───────┴────────┐
    │                │
    ▼                ▼
Backend Error    Frontend Error
    │                │
    ▼                ▼
Try-Catch       Axios error
Block           interceptor
    │                │
    ▼                ▼
Log error       Extract error
to console      message
    │                │
    ▼                ▼
Return JSON     Display error
response        to user
    │                │
    ▼                ▼
{               Alert/Toast
  success:      notification
  false,            │
  message:          ▼
  "Error..."    User sees
}               friendly
    │           message
    └───────┬────────┘
            │
            ▼
User can retry or take corrective action
```

---

**This flowchart represents the complete working scenario of the AIHub platform from user interaction to data flow and system responses.**
