const { findById } = require("./models/campground");

const express = require("express"),
    app = express(),
    flash = require("connect-flash"),
    { urlencoded } = require("express"),
    mongoose = require('mongoose'),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    moment = require("moment"); // Import moment
    // seedDB = require("./seed");

const campgroundsRoute = require("./routes/campgrounds"),
    commentsRoute = require("./routes/comments"),
    indexRoute = require("./routes/auth");

const port = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://obicharles94:Degame042@scicluster.gfeypot.mongodb.net/?retryWrites=true&w=majority&appName=sciCluster')
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.log('Database connection error:', err));


//mongodb://localhost:27017/yelp_camp

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

app.locals.moment = moment; // Make moment available in all EJS templates

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Deal with it",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoute);
app.use("/campgrounds", campgroundsRoute);
app.use("/campgrounds/:id/comments", commentsRoute);


app.listen(port, function () {
    console.log("YelpCamp started running on port 3000");
});

// const express = require("express"),
//       flash = require("connect-flash"),
//       { urlencoded } = require("express"),
//       mongoose = require("mongoose"),
//       passport = require("passport"),
//       LocalStrategy = require("passport-local"),
//       methodOverride = require("method-override"),
//       Campground = require("./models/campground"),
//       Comment = require("./models/comment"),
//       User = require("./models/user"),
//       seedDB = require("./seed");

// const campgroundsRoute = require("./routes/campgrounds"),
//       commentsRoute = require("./routes/comments"),
//       indexRoute = require("./routes/auth");

// const app = express();
// const port = process.env.PORT || 3000;

// // MongoDB connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yelp_camp', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log('Database connected successfully'))
// .catch(err => console.error('Database connection error:', err));

// // Middleware setup
// app.use(urlencoded({ extended: true }));
// app.set("view engine", "ejs");
// app.use(express.static(__dirname + "/public"));
// app.use(methodOverride("_method"));
// app.use(flash());

// // Seed the database (uncomment in development)
// // seedDB();

// // Passport configuration
// app.use(require("express-session")({
//     secret: process.env.SESSION_SECRET || "Deal with it",
//     resave: false,
//     saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// // Middleware for flash messages and current user
// app.use((req, res, next) => {
//     res.locals.currentUser = req.user;
//     res.locals.error = req.flash("error");
//     res.locals.success = req.flash("success");
//     next();
// });

// // Routes
// app.use("/", indexRoute);
// app.use("/campgrounds", campgroundsRoute);
// app.use("/campgrounds/:id/comments", commentsRoute);

// // Start the server
// app.listen(port, () => {
//     console.log(`YelpCamp started running on port ${port}`);
// });
