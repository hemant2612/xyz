const express = require('express');
const { check } = require('express-validator/check');
const router = express.Router();
var Page = require('../models/page');
const auth =require('../config/auth');
const isadmin=auth.isAdmin;
// 
//  GET Page index
// 
router.get('/', isadmin,(req, res) => {
    Page.find({}).exec((err, pages) => {

        res.render('admin/pages', {
            pages: pages
        })
    })
})

// GET add pages

router.get('/addpage',isadmin, (req, res) => {
    var title = "";
    var slug = "";
    var content = "";

    res.render('admin/add_Page', {
        title: title,
        slug: slug,
        content: content
    })
})

// 
// POST add page
// 
router.post('/addpage', (req, res) => {
    req.checkBody('title', 'Title must have a value').notEmpty();
    req.checkBody('content', 'Content must have a value').notEmpty();
    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "") {
        slug = title.replace(/\s+/g, '-').toLowerCase();

    }
    var content = req.body.content;

    var errors = req.validationErrors();
    if (errors) {
        console.log('error');
        res.render('admin/add_Page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content
        })
    } else {
        Page.findOne({ slug: slug }, (err, data) => {
            if (data) {
                req.flash('danger', 'page slug exists ,choose another');
                res.render('admin/add_Page', {

                    title: title,
                    slug: slug,
                    content: content
                })
            } else {

                var page = new Page({
                    title: title,
                    slug: slug,
                    content: content,
                    sorting: 100
                })
                page.save((err) => {
                    if (err) {
                        return console.log(err);
                    }
                    Page.find({}).exec((err, pages) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            req.app.locals.pages = pages;
                        }
                    })
                    req.flash('success', 'Page added');
                    res.redirect('/admin/pages');
                })
            }
        })

    }
})

// delete pages
router.get('/delete-page/:id',isadmin, (req, res) => {

    var del = Page.findByIdAndDelete(req.params.id);
    del.exec((err, pages) => {
        if (err) throw err;
        Page.find({}).exec((err, pages) => {
            if (err) {
                console.log(err);
            }
            else {
                req.app.locals.pages = pages;
            }
        })
        req.flash('success', 'data deleted');
        res.redirect('/admin/pages');
    });

})

// EDIT page
// 
router.get('/edit-page/:id',isadmin, (req, res) => {

    var edit = Page.findById(req.params.id);
    edit.exec((err, page) => {
        if (err) throw err;
        // console.log(`page:${data}`);
        
        res.render('admin/edit', {
            heading: "edit employee records",
            title: page.title,
            slug: page.slug,
            content: page.content,
            id: page._id
        })
    });

})
// 
// UPDATE EDIT Page
// 
router.post('/update',isadmin, (req, res) => {
    req.checkBody('title', 'Title must have a value').notEmpty();
    req.checkBody('content', 'Content must have a value').notEmpty();
    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "") {
        slug = title.replace(/\s+/g, '-').toLowerCase();

    }
    var content = req.body.content;
    var id = req.body.id;
    var errors = req.validationErrors();
    if (errors) {

        res.render('admin/edit', {
            errors: errors,
            title: title,
            slug: slug,
            content: content,
            id: id
        });
    } else {
        Page.findOne({ slug: slug, _id: { '$ne': id } }, (err, data) => {
            if (data) {
                req.flash('danger', 'page slug exists ,choose another');
                res.render('admin/edit', {

                    title: title,
                    slug: slug,
                    content: content,
                    id: id

                })
            } else {
                var update = Page.findByIdAndUpdate(req.body.id, {
                    title: title,
                    slug: slug,
                    conten: content

                });
                update.exec((err, data) => {
                    if (err) throw err;
                    Page.find({}).exec((err, pages) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            req.app.locals.pages = pages;
                        }
                    })
                    req.flash('success', 'Page Added');
                    res.redirect('/admin/pages');
                })
            }
        })
    }





})
module.exports = router;