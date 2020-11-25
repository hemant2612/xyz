const express = require('express');
const fs = require('fs-extra');
var User = require('../models/user');
// const validator = require('validator');
// const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { sendEmail, sendCancelEmail } = require('../email/account');
// const { delete } = require('./products');
// const jwt=require('jsonwebtoken');
const router = express.Router();
// GET register

router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register'
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
    if(email){

        const mail=req.checkBody('email', 'Email is not valid').isEmail();
        console.log('mail',mail);
        console.log('boolean',mail.isBoolean);
        if(mail){
            req.checkBody('email', 'Email already in use!').isEmailExists(email,req.body.id);
        }
    }else{
        req.checkBody('email', 'Email is required!').notEmpty();
    }
    
    req.checkBody('username', 'Username is required!').notEmpty();
    req.checkBody('password', 'Password is required!').notEmpty();
    req.checkBody('password2', 'Confirm password is not match!').equals(password);
    
// ///////////////////////////////



///////////////////////////// 
    if (age == '') {
        req.checkBody('age', 'Age is required!').notEmpty();
    }
    else {
        if (age > 0) {
            req.checkBody('age', 'Age must be greater !').isInt({ gt: 1 });
        }
        else {
            req.checkBody('age', 'Age must be a positive!').isInt({ gt: 1 });
        }
    }

    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            title: 'register',
            user: null,
            errors: errors
        });
    }
    else {
        User.findOne({ username: username }, function (err, user) {
            if (err) console.log(err);
            if (user) {
                req.flash('danger', 'Username is exists,choose another');
                res.redirect('/users/register');
            } else {
                var user = new User({
                    name: name,
                    email: email,
                    username: username,
                    password: password,
                    age: age,
                    admin: 0
                });
                bcrypt.hash(user.password, 10, function (err, hash) {
                    if (err)
                        console.log(err);
                    user.password = hash;
                    user.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            req.flash('success', 'You are now register!');
                            sendEmail(user.email, user.name);
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
    req.flash('success', 'You have logged out!');
    res.redirect('/users/login');

});

// GET update user


//GET delete user
router.get('/me/:id', function (req, res) {

    User.findByIdAndDelete(req.params.id, function (err, user) {
        if (err) {
            console.log(user);
        }
        res.send(user);
        sendCancelEmail(user.email, user.name);
    })


});


// ACCOUnt details
router.get('/account/details/:id',function(req,res){
    User.findOne({id:req.params.id},function(err,user){
        if(err){
            console.log(err);
        }
        res.render('account',{
            user:user,
            title:'Account'
        });
    })
    
});

module.exports = router;