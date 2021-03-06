var express       = require("express");
var router        = express.Router();
var Campground    = require("../models/campground");
var middleware    = require("../middleware");

//INDEX - show all campgrounds
router.get("/",function(req,res){
    //Get all campgrounds from DB
    Campground.find({},function(err,allCampgrounds){
       if(err){
           console.log(err);
       }else{
           res.render("campgrounds/index",{campgrounds:allCampgrounds}); 
       }
    });
});

router.post("/",middleware.isLoggedIn,function(req,res){
    var  name   = req.body.name ; 
    var  price  = req.body.price ; 
    var  image = req.body.image ; 
    var  desc  = req.body.description ;
    var  author = {
        id:req.user.id,
        username: req.user.username
    }
    
    var  newCampground ={name: name,price:price,image: image,description: desc, author:author};
    
    //Creat a new campground and save to DB
    Campground.create(newCampground,function(err,newlyCreated){
       if(err){
           console.log(err);
       }else{
           //redirect to campgrounds page
           console.log(newlyCreated);
            res.redirect("/campgrounds"); 
       }
    });

});

//NEW - shows form to create new campground
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new"); 
});

//SHOW - shows more info about one campground
router.get("/:id",middleware.isLoggedIn,function(req,res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
       if(err){
           console.log(err);
       }else{
           //render to show page
           res.render("campgrounds/show",{campground:foundCampground}); 
       }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
                res.render("campgrounds/edit",{campground: foundCampground});
        });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground,function(err,updated){
          //redirect somewhere(show page)
          if(err){
              res.redirect("/campgrounds");
          }else{
              res.redirect("/campgrounds/"+ req.params.id);
          }
    });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err)
        {
             res.redirect("/campgrounds");
        }else{
             res.redirect("/campgrounds");
        }
    });
});



module.exports = router;