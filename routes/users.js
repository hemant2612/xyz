const express = require('express');
const fs = require('fs-extra');
const router = express.Router();
var User = require('../models/user');
// const validator = require('validator');
// const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const e = require('express');
const passport = require('passport');
// const jwt=require('jsonwebtoken');

// GET register

router.get('/register', (req, res) => {
    res.render('register', {
        title: 'register'
    });

})

// POST register
router.post('/register', (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var age = req.body.age;
    req.checkBody('name', 'Name is required!').notEmpty();
    req.checkBody('email', 'email is required!').isEmail();
    req.checkBody('username', 'username is required!').notEmpty();
    req.checkBody('password', 'password is required!').notEmpty();
    req.checkBody('password2', 'password2 is not match').equals(password);

    if (age == '') {
        req.checkBody('age', 'age is required!').notEmpty();
    }
    else {
        if (age > 0) {
            req.checkBody('age', 'age must be greater !').isInt({ gt: 1 });
        }
        else {
            req.checkBody('age', 'age must be a positive!').isInt({ gt: 1 });
        }
    }

    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            title: 'register',
            user:null,
            errors: errors
        });
    }
    else {
        User.findOne({ username: username }, function (err, user) {
            if (err) console.log(err);
            if (user) {
                req.flash('danger', 'username is exists,choose another');
                res.redirect('/users/register');
            } else {
                var user = new User({
                    name: name,
                    email: email,
                    username: username,
                    password: password,
                    age: age,
                    admin: 1
                });
                bcrypt.hash(user.password, 10, function (err, hash) {
                    if (err)
                        console.log(err);
                    user.password = hash;
                    user.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            req.flash('success', 'you are now register!');
                            res.redirect('/users/login');
                        }
                    });

                });
            }
        });
    }
});

// GET Login
router.get('/login', (req, res) => {
    if (res.locals.user) res.redirect('/products');
    res.render('login', {
        title: 'Login'
    });

})

// POST Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/products',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

// GET Logout
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success', 'you have logged out!');
    res.redirect('/users/login');

})
module.exports = router;