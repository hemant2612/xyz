const express = require('express');
const fs = require('fs-extra');
const product = require('../models/product');
const router = express.Router();
var Product = require('../models/product');

// ADD to cart

router.get('/add/:product', (req, res) => {
    console.log('inside cart.js');
    var slug = req.params.product;
    // console.log(slug);
    Product.findOne({ slug: slug }, function (err, p) {
        var newItem = true;
        if (err) {
            console.log(err);
        }
        // console.log('Array******'+req.session.cart);
        if (typeof req.session.cart == "undefined") {
            console.log('if part');
            req.session.cart = [];

            req.session.cart.push({
                title: slug,
                qty: 1,
                price: parseFloat(p.price).toFixed(2),
                image: '/products_image/' + p._id + '/' + p.image
            })
        }
        else {
            console.log('else Part')
            var cart = req.session.cart;
            for (var i = 0; i < cart.length; i++) {
                if (cart[i].title == slug) {
                    cart[i].qty = cart[i].qty + parseInt(1);
                    newItem = false;
                    break;
                }
            }
            if (newItem) {
                cart.push({
                    title: slug,
                    qty: 1,
                    price: parseFloat(p.price).toFixed(2),
                    image: '/products_image/' + p._id + '/' + p.image
                });
            }
        }
        console.log(req.session.cart);
        req.flash('success', 'product added');
        res.redirect('back');


    })

})

// GET CHECKOUT CART
router.get('/checkout', (req, res) => {
    if(req.session.cart && req.session.cart.length == 0){
        delete req.session.cart;
        res.redirect('/cart/checkout');
    }else{
        res.render('checkOut', {
            title: 'checkout',
            cart: req.session.cart
        })
    }
    
})

// GET UPDATE PRODUCT CART 
router.get('/update/:product', (req, res) => {
    var title = req.params.product;
    var action = req.query.action;
    var cart = req.session.cart;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].title == title) {
            switch (action) {
                case 'add':
                    cart[i].qty++;
                    break;
                case 'remove':
                    cart[i].qty--;
                    if(cart[i].qty<1) 
                    {cart.splice(i,1);}
                    break;
                case 'clear':
                    cart.splice(i, 1);
                    if (cart.length == 0) delete req.session.cart;
                    break;
                default:
                    console.log('update problem');
                    break;
            }
            break;
        }
    }
    req.flash('success','Cart updated !!');
    res.redirect('/cart/checkout');

})

// GET CLEAR CART
router.get('/clear', (req, res) => {
    delete req.session.cart;
    req.flash('success','Cart Cleared!');
    res.redirect('/cart/checkout');
    
})

// GET BUY-NOW CART
router.get('/buynow', (req, res) => {
    delete req.session.cart;
    
    res.sendStatus(200);
    
})

module.exports = router;