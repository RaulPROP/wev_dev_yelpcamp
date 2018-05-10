// all the middleware goes here

var Campground = require("../models/campground");
var Comment    = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        // Find the Campground
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err){
                req.flash("error", "Something went wrong, we could not find that Campground.");
                res.redirect("back");
            } else {
                // Does user owns the campground?
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Only the owner can edit a Campground.");
                    res.redirect("back")
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        // Find the Campground
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err){
                req.flash("error", "Something went wrong, we could not find that Comment.");
                res.redirect("back");
            } else {
                // Does user owns the comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You need to be the owner of the comment to do that.");
                    res.redirect("back")
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
}

module.exports = middlewareObj;