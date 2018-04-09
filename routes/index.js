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

module.exports = router;