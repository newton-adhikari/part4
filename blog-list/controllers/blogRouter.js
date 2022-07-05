const router = require("express").Router();
const Blog = require("../models/blog");

router.get("/", (req, res) => {
    Blog.find({})
        .then(blogs => res.json(blogs))
})

router.post("/", async (req, res) => {
    const {title, author, url} = req.body;
    
    if(!title || !url) return res.status(400).json({error: "missing title or url"});
    
    const blog = new Blog(req.body);
    const saved = await blog.save();
    res.status(201).json(saved);
})

router.delete("/:id", async(req, res) => {
    const blog = await Blog.findById(req.params.id);
    if(!blog) return res.status(400).json({error: "post not found"});
    
    await Blog.findByIdAndRemove(req.params.id);
    res.send();
})

module.exports = router;