const router = require("express").Router();
const Blog = require("../models/blog");

router.get("/", (req, res) => {
    Blog.find({})
        .then(blogs => res.json(blogs))
})

router.post("/", (req, res) => {
    const blog = new Blog(req.body);
    blog.save()
        .then(savedBlog => res.status(201).json(savedBlog))
        .catch(err => res.status(400).json({error: err.message}))
})

module.exports = router;