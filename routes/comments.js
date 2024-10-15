const express = require("express"),
      router  = express.Router({ mergeParams: true }),
      Campground = require("../models/campground"),
      Comment = require("../models/comment"),
      middleware = require("../middlewares");

// New comment form
router.get("/new", middleware.isLoggedIn, async function(req, res) {
    try {
        const foundCampground = await Campground.findById(req.params.id);
        res.render("comments/new", { camps: foundCampground });
    } catch (err) {
        console.log(err);
        req.flash("error", "Campground not found");
        res.redirect("/campgrounds");
    }
});

// Create new comment
router.post("/", middleware.isLoggedIn, async function(req, res) {
    try {
        const campground = await Campground.findById(req.params.id);
        if (!campground) {
            req.flash("error", "Campground not found");
            return res.redirect("/campgrounds");
        }

        const comment = new Comment(req.body.comments);
        comment.author.id = req.user._id;
        comment.author.username = req.user.username;

        await comment.save();
        campground.comments.push(comment);
        await campground.save();

        req.flash("success", "Comment was added successfully");
        res.redirect("/campgrounds/" + campground._id);
    } catch (err) {
        req.flash("error", "Comment couldn't be added");
        res.redirect("back");
    }
});

// Edit comment form
router.get("/:comment_id/edit", middleware.checkCommentOwnership, async function(req, res) {
    try {
        const foundComment = await Comment.findById(req.params.comment_id);
        if (!foundComment) {
            req.flash("error", "Comment not found");
            return res.redirect("back");
        }
        res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
    } catch (err) {
        req.flash("error", "Comment couldn't be found");
        res.redirect("back");
    }
});

// Update comment
router.put("/:comment_id", middleware.checkCommentOwnership, async function(req, res) {
    try {
        await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comments, { new: true });
        req.flash("success", "Comment updated successfully");
        res.redirect("/campgrounds/" + req.params.id);
    } catch (err) {
        req.flash("error", "Comment couldn't be updated");
        res.redirect("back");
    }
});

// Delete comment
router.delete("/:comment_id", middleware.checkCommentOwnership, async function(req, res) {
    try {
        await Comment.findByIdAndRemove(req.params.comment_id);
        req.flash("success", "Comment deleted successfully");
        res.redirect("/campgrounds/" + req.params.id);
    } catch (err) {
        req.flash("error", "Comment couldn't be deleted");
        res.redirect("back");
    }
});

module.exports = router;