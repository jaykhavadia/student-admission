const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user'); // MySQL User model
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const students = require('../models/Student');

// Public Route
router.get('/', forwardAuthenticated, (req, res) => {
  res.render('index', {
    user: req.user
  });
});

// POST /AdminLogin -> authenticate the user
router.post('/',
  passport.authenticate('local', {
    successRedirect: '/students',
    failureRedirect: '/',
    failureFlash: true
  }), (req, res) => {
    req.flash('success_msg', 'You are successfully logged in');
    res.redirect('/students');
  }
);

// Middleware for authentication -> provided by the passport library
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: "Unknown User" });
      }

      const isMatch = await User.comparePassword(password, user.password);
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});

module.exports = router;
