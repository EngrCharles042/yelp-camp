const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// Home route
router.get("/", (req, res) => {
    res.render("home");
});

// AUTH ROUTES
// Show register form
router.get("/register", (req, res) => {
    res.render("register");
});

// Handle user registration
router.post("/register", async (req, res) => {
    const newUser = new User({ username: req.body.username });
    try {
        const user = await User.register(newUser, req.body.password);
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Sign Up successful. Welcome " + req.body.username + "!!!");
            res.redirect("/campgrounds");
        });
    } catch (err) {
        req.flash("error", err.message);
        return res.redirect("back");
    }
});

// Show login form
router.get("/login", (req, res) => {
    res.render("login");
});

// Handle user login with custom callback for error handling
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            req.flash("error", err.message);
            return next(err);
        }
        if (!user) {
            req.flash("error", "Invalid username or password");
            return res.redirect("/login");
        }
        req.logIn(user, (err) => {
            if (err) {
                req.flash("error", err.message);
                return next(err);
            }
            req.flash("success", "Welcome back " + user.username);
            return res.redirect("/campgrounds");
        });
    })(req, res, next);
});

// Handle user logout (async handling for Passport 0.6+)
router.get("/logout", async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Successfully logged you out");
        res.redirect("/campgrounds");
    });
});

module.exports = router;