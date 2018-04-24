const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Home Page
router.get('/', ensureAuthenticated, function(req, res, next){
    res.render('index');
});

//Register Page
router.get('/register', function (req, res, next) {
    res.render('register');
});

//Login Page
router.get('/login', function (req, res, next) {
    res.render('login');
});

//Logout route
router.get('/logout', function (req, res, next) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});

// Register process

router.post('/register', function (req, res, next) {
    const name = req.body.name;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email must be a valid email address').isEmail();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();

    if(errors){
        console.log(errors);
        res.render('register', {
            errors: errors
        });
    }
    else {
        const newUser = new User({
           name: name,
           username: username,
           email: email,
           password: password
        });

        User.registerUser(newUser, function (err, user) {
            if(err) throw err;
            req.flash('success_msg', 'You are registered and can log in!');
            res.redirect('/login');
        });
    }
});

// Local Strategy
passport.use(new LocalStrategy(function (username, password, done) {
    User.getUserByUsername(username, function (err, user) {
        if(err) throw err;
        if(!user){
            return done(null, false, {message: 'No user found'});
        }

        User.comparePassword(password, user.password, function (err, isMatch) {
            if(err) throw err;
            if(isMatch){
                return done(null, user);
            } else{
                return done(null, false, {message: 'Wrong Password'});
            }
        });
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

// Login Post Request Processing
router.post('/login', function (req, res, next) {
   passport.authenticate('local', {
       successRedirect: '/',
       failureRedirect: '/login',
       failureFlash: true
   })(req, res, next);
});

//Access Control (secure routing)
function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash('error_msg', 'You are not authorised to view that page');
        res.redirect('/login');
    }
}

module.exports = router;