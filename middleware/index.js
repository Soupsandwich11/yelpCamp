var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");

// all the middleware in the app
var middlewareObj={};

middlewareObj.checkCampgroundOwership = function checkCampgroundOwership(req, res, next){
     if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
                req.flash("error", "That Campground Does Not Exist");
               res.redirect("back");
            } else {
                //does user own campground
                if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                     next();
                } else {
                    req.flash("error", "You Don't Have Permission To Do That");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You Need to Be Logged In to Do That!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwership = function (req, res, next){
     if(req.isAuthenticated()){
        Comment.findById(req.params.commentId, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "That Comment Cannot Be Found")
               res.redirect("back");
            } else {
                //does user own comment
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                     next();
                } else {
                    req.flash("error", "You Don't Have Permission to Do That!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You Need to Be Logged In to Do That!");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You Need to Be Logged In to Do That!");
    res.redirect("/login");
};
    


module.exports = middlewareObj;