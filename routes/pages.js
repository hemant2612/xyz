const express = require('express');
const router = express.Router();
var Page = require('../models/page');

router.get('/', (req, res) => {
    Page.findOne({ slug: "home" }, function (err, page) {
        if (err)
            console.log(err);
        
        if(!page){
            res.render('index',{title:"Home page"});
        }
        else{
        res.render('index', {
            title: page.title,
            content: page.content
        });
        }

    })
    
})


router.get('/:slug', (req, res) => {
    var slug = req.params.slug;
    Page.findOne({ slug: slug }, function (err, page) {
        if (err)
            console.log(err);
        if (!page) {
            res.redirect('/travel');
        }
        else {
            res.render('page_details', {
                title: page.title,
                content: page.content
            });
        }
    })

})


module.exports = router;