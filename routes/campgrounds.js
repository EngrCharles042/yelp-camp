const express = require("express"),
      router  = express.Router(),
      Campground = require("../models/campground"),
      middleware = require("../middlewares");

// Index - show all campgrounds
router.get("/", async function(req, res) {
    try {
        const allCampground = await Campground.find({});
        res.render("campgrounds/index", { camps: allCampground, currentUser: req.user });
    } catch (err) {
        req.flash("error", "Campgrounds not found");
        res.redirect("back");
    }
});

// Create - add new campground
router.post("/", middleware.isLoggedIn, async function(req, res){
    const { name, image, desc, price } = req.body;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newCamp = { name, image, description: desc, author, price };

    try {
        const newCampground = await Campground.create(newCamp);
        req.flash("success", "Campground was created successfully");
        res.redirect("/campgrounds");
    } catch (err) {
        req.flash("error", "Campground couldn't be created");
        res.redirect("back");
    }
});

// New - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// Show - shows more info about one campground
router.get("/:id", async function(req, res) {
    try {
        const foundCampground = await Campground.findById(req.params.id).populate("comments").exec();
        if (!foundCampground) {
            req.flash("error", "Campground not found");
            return res.redirect("back");
        }
        res.render("campgrounds/show", { camps: foundCampground });
    } catch (err) {
        req.flash("error", "Campground not found");
        res.redirect("back");
    }
});

// Edit - show form to edit a campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, async function(req, res){
    try {
        const foundCampground = await Campground.findById(req.params.id);
        res.render("campgrounds/edit", { camp: foundCampground });
    } catch (err) {
        req.flash("error", "Campground not found");
        res.redirect("back");
    }
});

// Update - update a particular campground
router.put("/:id", middleware.checkCampgroundOwnership, async function(req, res){
    try {
        const updatedCampground = await Campground.findByIdAndUpdate(req.params.id, req.body.camp, { new: true });
        req.flash("success", "Campground was updated successfully");
        res.redirect("/campgrounds/" + req.params.id);
    } catch (err) {
        req.flash("error", "Campground couldn't be updated");
        res.redirect("/campgrounds");
    }
});

// Delete - remove a particular campground
router.delete("/:id", middleware.checkCampgroundOwnership, async function(req, res){
    try {
        await Campground.findByIdAndRemove(req.params.id);
        req.flash("success", "Campground was deleted successfully");
        res.redirect("/campgrounds");
    } catch (err) {
        req.flash("error", "Campground couldn't be deleted");
        res.redirect("/campgrounds");
    }
});

module.exports = router;