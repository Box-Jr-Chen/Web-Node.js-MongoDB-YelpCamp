var Campground    = require("../models/campground");
var Comment       = require("../models/comment");
//all the middleare goes here
var middleareObj ={};

middleareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err, foundCampground){
           if(err)
           {
               req.flash("error","Campground not found!");
               res.redirect("back");
           } else {
                //does user won the campground?
               // console.log(foundCampground.author.id);
                if(foundCampground.author.id.equals(req.user._id)) {
                     next();
                }
                 else{
                     req.flash("error","You don't have permission to do that!");
                     res.redirect("back");
                 }
           }
        });
    }else{
        req.flash("error","You need to be logged in to do that!");
        res.redirect("back");
    }
}

middleareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err, foundComment){
           if(err)
           {
               res.redirect("back");
           } else {
                //does user won the comment?
                if(foundComment.author.id.equals(req.user._id)) {
                     next();
                }
                 else{
                      req.flash("error","You don't have permission to do that");
                      res.redirect("back");
                 }
           }
        });
    }else{
       res.redirect("back");
    }
}


middleareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that!");
    res.redirect("/login");
};


module.exports = middleareObj;