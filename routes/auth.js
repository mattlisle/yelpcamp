const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();

// Auth routes
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (error, _user) => {
    if (error) {
      req.flash('error', error.message);
      res.redirect('register');
      return undefined;
    }
    passport.authenticate('local')(
      req,
      res,
      () => { res.redirect('/campgrounds'); }
    );
  });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post(
  '/login',
  passport.authenticate(
    'local',
    {
      successRedirect: 'campgrounds',
      failureRedirect: 'login',
      failureFlash: true,
    }
  ),
  (req, res) => {
    res.redirect('back');
  }
);

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logout successful');
  res.redirect('/campgrounds');
});

module.exports = router;
