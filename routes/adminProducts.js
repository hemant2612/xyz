const express = require('express');
const { check } = require('express-validator/check');
const router = express.Router();
var multer = require('multer');
const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
var resizeImg=require('resize-img');
const auth =require('../config/auth');
const isadmin=auth.isAdmin;


// UPLOAD IMAGE USING MULTER*******************************

// var storage = multer.diskStorage({
//     destination:"./public/uploads_product_image/",
//     filename: (req, file, cb) => { 
//         console.log(req);
//         console.log(file);
//         console.log(file.fieldname);
//         console.log(Date.now());
//         console.log(path.extname(file.originalname));
//         cb(null,file.fieldname+"_"+Date.now() + path.extname(file.originalname));
//     }

//   });
//   var upload=multer({storage:storage}).single('file');

// *************************************************************
// GET product model
var Product = require('../models/product');

// 
//  GET Product index
// 
router.get('/',isadmin, (req, res) => {
    // res.send('product area')
    var count;
    Product.count(function (err, c) {
        count = c;
    });
    Product.find({}).exec((err, data) => {
        res.render('admin/products_Page', {
            products: data,
            count: count
        })
    })
})

// GET add product

router.get('/addproduct',isadmin, (req, res) => {
    var title = "";
    var desc = "";
    var price = "";
    var image = "";
    res.render('admin/add_Product', {
        title: title,
        desc: desc,
        price: price,
        image: image
    })
})

// 
// POST add product
// 
router.post('/upload-add-product', (req, res, next) => {
    console.log('running+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    // console.log(req);
    // console.log(req.files+'1');
    // console.log(req.files.image+'2');
    // console.log(req.files.image.name+'3');
    let imageFile;
    if (req.files != null) {
        imageFile = req.files.image.name;
    }
    else {
        imageFile = "";
    }
    // let imageFile = typeof req.files.image !== "undefined" ? req.files.image.name: "";
    // console.log(imageFile+'4');
    req.checkBody('title', 'Title must have a value').notEmpty();
    req.checkBody('price', 'Price must have a value').isDecimal();
    req.checkBody('desc', 'Description must have a value').notEmpty();
    console.log('run');
    req.checkBody('file', 'you must upload an image').isImage(imageFile);
    console.log('run2');
    var title = req.body.title;
    var desc = req.body.desc;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var price = req.body.price;

    var errors = req.validationErrors();
    if (errors) {
        console.log('error');
        res.render('admin/add_Product', {
            errors: errors,
            title: title,
            price: price,
            desc: desc,

        })
    } else {
        console.log('else container');
        Product.findOne({ slug: slug }, (err, data) => {
            if (data) {
                req.flash('danger', 'Title already exists ,choose another!');
                res.render('admin/add_Product', {
                    title: title,
                    price: price,
                    desc: desc,

                })
            } else {
                console.log('else + container');
                var price2 = parseFloat(price).toFixed(2);

                var product = new Product({
                    title: title,
                    slug: slug,
                    price: price2,
                    desc: desc,
                    image: imageFile
                })
                product.save((err) => {
                    if (err) {
                        return console.log(err);
                    }
                    console.log('mkdir');
                    
                    mkdirp('public/products_image/' + product._id, function (err) {
                        return console.log(err);
                    });

                    console.log('mkdir2');
                    mkdirp('public/products_image/' + product._id + '/gallery', function (err) {
                        return console.log(err);
                    });

                    mkdirp('public/products_image/' + product._id + '/gallery/thumbs', function (err) {
                        return console.log(err);
                    });

                    if (imageFile != "") {
                        let imageSource = req.files.image;
                        let path = 'public/products_image/' + product._id + '/' + imageFile;
                        // var path=`public/products_image/${product._id}/${imageFile}`;
                        imageSource.mv(`public/products_image/${product._id}/` + imageFile, function (err) {

                            console.log('error:' + err);
                        });
                    }
                    // console.log('hy*************')
                    req.flash('success', 'Product successfully added!');
                    res.redirect('/admin/products');
                })
            }
        })

    }

})



// EDIT product
// 
router.get('/edit-product/:id',isadmin, (req, res) => {
    var errors;
    if (req.session.errors) {
        errors = req.session.errors;
        req.session.errors = null;
    }

    Product.findById(req.params.id, function (err, p) {
        if (err) {
            console.log(err);
            res.render('/admin/products');
        }
        else {
            console.log(p);
            var galleryDir = 'public/products_image/' + p._id + '/gallery';
            var galleryImages = null;
            fs.readdir(galleryDir, function (err, files) {
                if (err) {
                    console.log(err);
                } else {
                    galleryImages = files;
                    res.render('admin/edit_product', {
                        title: p.title,
                        errors: errors,
                        desc: p.desc,
                        price: p.price,
                        image: p.image,
                        galleryImages: galleryImages,
                        id: p._id

                    })
                }
            })
        }

    })
})
// 
// UPDATE EDIT Product
// 
router.post('/update-edit-product/:id',(req, res) => {

    let imageFile;
    console.log('files' + req.files);
    if (req.files != null) {
        imageFile = req.files.image.name;
    }
    else {
        imageFile = "";
    }
    // let imageFile = typeof req.files.image !== "undefined" ? req.files.image.name: "";
    // console.log(imageFile+'4');
    req.checkBody('title', 'Title must have a value').notEmpty();
    req.checkBody('price', 'Price must have a value').isDecimal();
    req.checkBody('desc', 'Description must have a value').notEmpty();
    console.log('run');
    req.checkBody('file', 'you must upload an image').isImage(imageFile);
    console.log('run2');
    var title = req.body.title;
    var desc = req.body.desc;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var price = req.body.price;
    var id = req.params.id;
    var pimage = req.body.pimage;
    var errors = req.validationErrors();
    if (errors) {
        req.session.error = errors;
        res.render('/admin/products/edit-product/' + id);
    } else {
        Product.findOne({ slug: slug, _id: { '$ne': id } }, function (err, p) {
            if (err) {
                console.log(err);
            }
            if (p) {
                req.flash('danger', 'Product Title exists,choose another');
                res.redirect('/admin/products/edit-product/' + id);
            }
            else {
                Product.findById(id, function (err, p) {
                    if (err) {
                        console.log(err);
                    }
                    p.title = title;
                    p.slug = slug;
                    p.desc = desc;
                    p.price = parseFloat(price).toFixed(2);
                    if (imageFile != "") {
                        p.image = imageFile;
                    }
                    p.save(function (err) {
                        if (err) {
                            console.log(err);
                        }
                        if (imageFile != "") {
                            if (pimage != "") {
                                fs.remove('public/products_image/' + id + '/' + pimage, function (err) {
                                    if (err) {
                                        console.log(err);
                                    }
                                })
                            }
                            let imageSource = req.files.image;
                            // let path = 'public/products_image/' + id + '/' + imageFile;

                            imageSource.mv(`public/products_image/${id}/` + imageFile, function (err) {

                                console.log('error:' + err);
                            });
                        }
                        req.flash('success', 'Product successfully edited!');
                        res.redirect('/admin/products/edit-product/' + id);
                    })
                })
            }
        })
    }

})
// POST Product Gallery
router.post('/product-gallery/:id', (req, res) => {
    
    let productImage=req.files.file;
    let filename=req.files.file.name;
    let id=req.params.id;
    let path='public/products_image/'+id+'/gallery/'+filename;
    var thumbsPath='public/products_image/'+id+'/gallery/thumbs/'+filename;
    productImage.mv(path,function(err){
        if(err){
            console.log(err);
        }
        resizeImg(fs.readFileSync(path),{width:100,height:100}).then(function(buf){
            fs.writeFileSync(thumbsPath,buf);
        });
    })
    res.sendStatus(200);
})

// Delete Gallery Images
router.get('/delete-image/:image',isadmin, (req, res) => {
    let originalImage='public/products_image/'+req.query.id+'/gallery/'+req.params.image;
    let thumbImage='public/products_image/'+req.query.id+'/gallery/thumbs/'+req.params.image;
    fs.remove(originalImage,function(err){
        if(err){
            console.log(err);
        }
        else{
            fs.remove(thumbImage,function(err){
                if(err){
                    console.log(err);
                }else{
                    req.flash('success','Gallery product delted successfully!');
                    res.redirect('/admin/products/edit-product/' + req.query.id);
                }
            })
        }
    })
})


// delete product
router.get('/delete-product/:id',isadmin, (req, res) => {
    var id=req.params.id;
    var path='public/products_image/'+id;
    fs.remove(path,function(err){
        if(err){
            console.log(err);
        }
        else{
            Product.findByIdAndRemove(id,function(err){
                if(err){
                    console.log(err);
                }
                
            })
            req.flash('success', 'product deleted');
            res.redirect('/admin/products');
        }
    })
    

})
module.exports = router;