const mongoose = require('mongoose');

// Define the blog post schema
const blogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    datePublished: {
        type: Date,
        default: Date.now
    },
    comments: [commentSchema]
});

// Create the model from the schema
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;
