const router = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const tokenExtractor = (req) => {
    const token = req.get("authorization");
    if(token && token.toLowerCase().startsWith("bearer")) {
        return token.substring(7);
    }
    return null;
}

router.get("/", async (req, res) => {
    const blogs = await Blog.find({}).populate("user", {username: 1, name: 1});
    res.json(blogs);
})

router.post("/", async (req, res, next) => {
    try {
        const token = tokenExtractor(req);
        if(!token) return res.status(401).json({error: "unverified user"});
    
        const decoded = jwt.verify(token, process.env.SECRET);
        const {title, author, url} = req.body;
        
        const user = await User.findById(decoded.id);
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

router.delete("/:id", async(req, res) => {
    const blog = await Blog.findById(req.params.id);
    if(!blog) return res.status(400).json({error: "post not found"});

    await Blog.findByIdAndRemove(req.params.id);
    res.send();
})

router.put("/:id", async(req, res) => {
    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
    if(!updated) res.status(400).json({error: "post not found"});
    res.json(updated);
})

module.exports = router;