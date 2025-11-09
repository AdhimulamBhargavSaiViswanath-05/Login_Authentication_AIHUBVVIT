const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcryptjs');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    accessType: 'offline',
    prompt: 'consent select_account',  // Force Google to show account selection and permission screen every time
    passReqToCallback: true  // Pass request to callback to access session
  },
  async (req, accessToken, refreshToken, profile, done) => {
    const newUser = {
      googleId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      profilePicture: profile.photos[0].value,
      isVerified: true  // Google OAuth users are pre-verified by Google
    };

    try {
      let user = await User.findOne({ googleId: profile.id });
      let isNewUser = false;

      if (user) {
        // Existing user with Google account - just login
        console.log('🔍 Google OAuth - EXISTING USER LOGIN');
      } else {
        // Check if user exists with same email (from manual signup or other OAuth)
        user = await User.findOne({ email: profile.emails[0].value });
        
        if (user) {
          // Link Google account to existing user and mark as verified
          user.googleId = profile.id;
          user.isVerified = true;  // Mark as verified when linking OAuth account
          user.profilePicture = profile.photos[0].value; // Update profile picture
          await user.save();
          console.log('🔗 Google account linked to existing user');
        } else {
          // New user - create with verified status (Google already verified email)
          user = await User.create(newUser);
          isNewUser = true;
          console.log('🆕 NEW Google signup - Email already verified by Google');
        }
      }

      console.log('👤 User:', user.name, '-', user.email);
      console.log('✅ Verified:', user.isVerified);
      
      // Attach flag directly to user object (temporary, non-persisted)
      user._isNewGoogleSignup = isNewUser;
      
      done(null, user);
    } catch (err) {
      console.error('❌ Google OAuth Error:', err);
      done(err, null);
    }
  }
));

// Microsoft Strategy
passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: process.env.MICROSOFT_CALLBACK_URL,
    tenant: process.env.MICROSOFT_TENANT_ID,
    scope: ['user.read'],
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    const newUser = {
      microsoftId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      profilePicture: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
      isVerified: true  // Microsoft OAuth users are pre-verified by Microsoft
    };

    try {
      let user = await User.findOne({ microsoftId: profile.id });
      let isNewUser = false;

      if (user) {
        // Existing user with Microsoft account - just login
        console.log('🔍 Microsoft OAuth - EXISTING USER LOGIN');
      } else {
        // Check if user exists with same email (from manual signup or other OAuth)
        user = await User.findOne({ email: profile.emails[0].value });
        
        if (user) {
          // Link Microsoft account to existing user and mark as verified
          user.microsoftId = profile.id;
          user.isVerified = true;  // Mark as verified when linking OAuth account
          if (profile.photos && profile.photos[0]) {
            user.profilePicture = profile.photos[0].value; // Update profile picture
          }
          await user.save();
          console.log('🔗 Microsoft account linked to existing user');
        } else {
          // New user - create with verified status (Microsoft already verified email)
          user = await User.create(newUser);
          isNewUser = true;
          console.log('🆕 NEW Microsoft signup - Email already verified by Microsoft');
        }
      }

      console.log('👤 User:', user.name, '-', user.email);
      console.log('✅ Verified:', user.isVerified);
      
      // Attach flag directly to user object (temporary, non-persisted)
      user._isNewMicrosoftSignup = isNewUser;
      
      done(null, user);
    } catch (err) {
      console.error('❌ Microsoft OAuth Error:', err);
      done(err, null);
    }
  }
));

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'Incorrect email.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password.' });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
