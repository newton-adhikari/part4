const router = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { userExtractor } = require("../utils/middleware");

router.get("/", async (req, res) => {
    const blogs = await Blog.find({}).populate("user", {username: 1, name: 1});
    res.json(blogs);
})

router.post("/", userExtractor, async (req, res, next) => {
    try {
        const {title, url} = req.body;
        
        const user = req.user;  
        if(!user) return res.status(400).json({error: "not authorized"});
    
        if(!title || !url) return res.status(400).json({error: "missing title or url"});
        
        const blog = new Blog(req.body);
        blog.user = user._id;
        const saved = await blog.save();
    
        user.blogs = user.blogs.concat(blog)
        await user.save();
    
        res.status(201).json(saved); 
    }
    catch(e) {
        next(e);
    }
})

router.delete("/:id", userExtractor, async(req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if(!blog) return res.status(400).json({error: "post not found"});
    
        const userId = blog.user._id.toString();
        if(userId !== req.user._id.toString()) return res.status(401).json({error: "unauthorized"});

        await Blog.findByIdAndRemove(req.params.id);
        res.send();
    }
    catch(e) {
        next(e);
    }
})

router.put("/:id", async(req, res) => {
    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
    if(!updated) res.status(400).json({error: "post not found"});
    res.json(updated);
})

module.exports = router;