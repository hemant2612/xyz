const express = require('express');
const fs = require('fs-extra');
const router = express.Router();
var Product = require('../models/product'); 
const auth =require('../config/auth');
const isUser=auth.isUser;
// GET all products

router.get('/',isUser,(req, res) => {
    Product.find(function (err, products) {
        if (err)
            console.log(err);

        console.log(' products.js');
        res.render('all_products', {
            title: 'All products',
            products:products
        });
        

    })
    
})

// 
// GET product details
// 
router.get('/:slug',isUser,(req, res) => {
    var galleryImages=null;
    var slug = req.params.slug;
    Product.findOne({ slug: slug }, function (err, product) {
        if (err)
            console.log(err);
        
        else {
            var galleryDir='public/products_image/'+product._id+'/gallery';
            fs.readdir(galleryDir,function(err,files){
                if(err){
                    console.log(err);
                }
                else{
                    galleryImages=files;
                    res.render('product',{
                        title:product.title,
                        galleryImages:galleryImages,
                        p:product
                    })
                }
            })
           
        }
    })

})


module.exports = router;