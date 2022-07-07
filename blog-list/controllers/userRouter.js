const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

router.get("/", async(req, res) => {
    const users = await User.find({});
    res.json(users);
})

router.post("/", async(req, res, next) => {
    try {
        const {username, password, name} = req.body;
        const user = new User({username, password, name});
    
        const hashed = await bcrypt.hash(password, 10);
        user.password = hashed;
    
        const saved = await user.save();
        res.status(201).json(saved);
    
    }
    catch(e) {
        next(e)
    }
})

module.exports = router;