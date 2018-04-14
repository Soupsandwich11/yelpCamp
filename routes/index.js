var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campgrounds");
var middleware = require("../middleware");

//Landing Route

router.get("/", function(req, res){
    res.render("landing");
});


//Registration Route

router.get("/register", function(req, res) {
   res.render("register"); 
});

// Registraing Post Route

router.post("/register", function(req, res) {
    var newUser = new User({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            avatar: req.body.avatar
        });
    if(req.body.adminCode === ADMINCODE){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
          if(err) {
           req.flash("error", err.message);
           return res.render("register");
       } 
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to YelpCamp " + user.username);
           res.redirect("/campgrounds");
       });
   });
});

//Login Route

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
});

//Logout Route

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged You Out!");
    res.redirect("/campgrounds");
});

// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

// user profile

router.get("/users/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "Something Went Wrong");
            res.redirect("/campgrounds");
        }
        Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds){
           if(err){
            req.flash("error", "Something Went Wrong");
            res.redirect("/campgrounds");
        }  
        res.render("users/show", {user: foundUser, campgrounds: campgrounds});
    }); });
        
});

//add edit profile route and page in v14

module.exports = router;