const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

const seeds = [
    {
        name: "Cloud's Rest", 
        image: "https://images.unsplash.com/photo-1599507834326-c0dd2049af6c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
        name: "Desert Mesa", 
        image: "https://images.unsplash.com/photo-1599502453136-d16af5ba6402?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
        name: "Canyon Floor", 
        image: "https://images.unsplash.com/photo-1599533680895-745e30418674?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
        name: "Camp Higa", 
        image: "https://images.unsplash.com/photo-1599423561457-55f6911c46c3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    }
];

async function seedDB() {
    try {
        // Remove all campgrounds and comments
        await Campground.deleteMany({});
        console.log("Removed campgrounds!");

        await Comment.deleteMany({});
        console.log("Removed comments!");

        // Add new campgrounds
        for (const seed of seeds) {
            const campground = await Campground.create(seed);
            console.log("Added a campground");

            // Create a comment
            const comment = await Comment.create({
                text: "This place is great, but I wish there was internet",
                author: "Homer"
            });
            campground.comments.push(comment);
            await campground.save();
            console.log("Created new comment");
        }
    } catch (err) {
        console.error(err);
    }
}

module.exports = seedDB;