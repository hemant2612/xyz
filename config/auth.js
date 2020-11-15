const isUser=function(req,res,next){
    
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash('danger','Please log in.');
        res.redirect('/users/login');
    }
}
const isAdmin=function(req,res,next){
    console.log(res.locals.user);
    if(req.isAuthenticated() && res.locals.user.admin === 1){
        next();
    }else{ 
        req.flash('danger','Please log in as admin.');
        res.redirect('/users/login');
    }
}
module.exports={
    isUser,
    isAdmin
}