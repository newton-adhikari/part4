const router = require("express").Router();
const Blog = require("../models/blog");

router.get("/", (req, res) => {
    Blog.find({})
        .then(blogs => res.json(blogs))
})

router.post("/", async (req, res) => {
    const blog = new Blog(req.body);
    const saved = await blog.save();
    res.status(201).json(saved);
})

module.exports = router;