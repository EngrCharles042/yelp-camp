const Campground = require("../models/campground");
const Comment = require("../models/comment");

const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = async function(req, res, next) {
    if (req.isAuthenticated()) {
        try {
            const foundCampground = await Campground.findById(req.params.id);
            if (!foundCampground) {
                req.flash("error", "Campground not found");
                return res.redirect("/campgrounds");
            }
            // Check if the user is the author of the campground
            if (foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "Permission not granted");
                res.redirect("/campgrounds");
            }
        } catch (err) {
            console.error(err);
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        }
    } else {
        req.flash("error", "You need to be logged in to do that!!!");
        res.redirect("/login");
    }
};

middlewareObj.checkCommentOwnership = async function(req, res, next) {
    if (req.isAuthenticated()) {
        try {
            const foundComment = await Comment.findById(req.params.comment_id);
            if (!foundComment) {
                req.flash("error", "Comment not found");
                return res.redirect("/campgrounds");
            }
            // Check if the user is the author of the comment
            if (foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "Permission not granted");
                res.redirect("back");
            }
        } catch (err) {
            console.error(err);
            req.flash("error", "Comment not found");
            res.redirect("/campgrounds");
        }
    } else {
        req.flash("error", "You need to be logged in to do that!!!");
        res.redirect("/login");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You must be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;