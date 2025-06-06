// ai-blog-hub/routes/blogRoutes.js
const express = require('express');
const BlogPost = require('../models/BlogPost');
const Subscriber = require('../models/Subscriber'); // For newsletter operations in admin
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// Initialize Google Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- Blog Post Routes ---

// GET all blog posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await BlogPost.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new blog post
router.post('/posts', async (req, res) => {
    const { title, subtitle, content, category, author, email } = req.body;
    const newPost = new BlogPost({
        title, subtitle, content, category, author, email
    });
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a blog post by ID (for admin)
router.delete('/posts/:id', async (req, res) => {
    try {
        const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Comment Routes ---

// POST a comment to a specific blog post
router.post('/posts/:postId/comments', async (req, res) => {
    const { author, content } = req.body;
    try {
        const post = await BlogPost.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const newComment = { author, content, date: new Date() };
        post.comments.push(newComment);
        await post.save();
        res.status(201).json(newComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a comment from a specific blog post (for admin)
router.delete('/posts/:postId/comments/:commentId', async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        post.comments = post.comments.filter(
            comment => comment._id.toString() !== req.params.commentId
        );
        await post.save();
        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Subscriber Routes ---

// POST a new subscriber
router.post('/subscribe', async (req, res) => {
    const { email } = req.body;
    try {
        const existingSubscriber = await Subscriber.findOne({ email });
        if (existingSubscriber) {
            return res.status(409).json({ message: 'Email already subscribed!' });
        }
        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();
        res.status(201).json({ message: 'Successfully subscribed to newsletter!' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET all subscribers (for admin)
router.get('/subscribers', async (req, res) => {
    try {
        const subscribers = await Subscriber.find();
        res.json(subscribers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE a subscriber by ID (for admin)
router.delete('/subscribers/:id', async (req, res) => {
    try {
        const deletedSubscriber = await Subscriber.findByIdAndDelete(req.params.id);
        if (!deletedSubscriber) {
            return res.status(404).json({ message: 'Subscriber not found' });
        }
        res.json({ message: 'Subscriber removed successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- AI Generation Route ---

router.post('/ai-generate', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required for AI generation.' });
    }

    try {
        const result = await model.generateContent(`Generate 5 blog post titles, 5 subtitles, and 3 paragraphs for a blog post on the topic: "${prompt}". Provide them in a structured JSON format with keys: "titles", "subtitles", "descriptions". Make sure the response is valid JSON and directly parsable.`);
        const response = await result.response;
        let text = response.text(); // Get the raw text from the AI

        // --- NEW LOGIC ADDED HERE TO EXTRACT JSON ---
        // Use a regular expression to find content between ```json and ```
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
            text = jsonMatch[1]; // Use the extracted JSON string
        } else {
            // Fallback if markdown fences aren't found, try to clean up leading/trailing whitespace
            text = text.trim();
        }
        // --- END NEW LOGIC ---

        // Attempt to parse the JSON.
        try {
            const parsedSuggestions = JSON.parse(text);
            res.json(parsedSuggestions);
        } catch (jsonErr) {
            console.error("Failed to parse AI response as JSON:", text);
            // If parsing still fails after stripping markdown, return a more robust error
            res.status(500).json({
                message: "AI generated content could not be parsed as structured JSON. Please try again with a different prompt.",
                rawText: text, // Include rawText for debugging
                error: jsonErr.message
            });
        }

    } catch (err) {
        console.error("AI generation error:", err);
        res.status(500).json({ message: 'Failed to generate AI content.', error: err.message });
    }
});


module.exports = router;