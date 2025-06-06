// ai-blog-hub/models/BlogPost.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const blogPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String },
    content: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: String, required: true },
    email: { type: String, required: true }, // Author's email
    date: { type: Date, default: Date.now },
    comments: [commentSchema] // Array of embedded comments
});

module.exports = mongoose.model('BlogPost', blogPostSchema);