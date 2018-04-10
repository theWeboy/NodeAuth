var express = require('express');
var router = express.Router();

// Home Page
router.get('/', function(req, res, next){
    res.render('index');
});

//Register Page
router.get('/register', function (req, res, next) {
    res.render('register');
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

    var errors = req.validationErrors();

    if(errors){
        res.render('register', {
            errors: errors
        });
    }
    else {
        console.log('SUCCESS');
        return;
    }
});


module.exports = router;