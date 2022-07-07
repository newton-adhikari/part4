const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.post("/", async(req, res, next) => {
    const {username, password} = req.body;

    if(!username || !password) return res.status(401).json({error: "username and password must be present"})

    const user = await User.findOne({username});
    if(!user) return res.status(401).json({error: "invalid username"})

    const matched = await bcrypt.compare(password, user.password);
    if(!matched) return res.status(401).json({error: "invalid credentials"});

    const userToken = {
        id: user._id.toString(),
        username
    }

    const token = jwt.sign(userToken, process.env.SECRET);

    res.json({token, name: user.name, username});
})

module.exports = router;