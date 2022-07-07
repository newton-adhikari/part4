const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const blogRouter = require("./controllers/blogRouter");
const userRouter = require("./controllers/userRouter");
const loginRouter = require("./controllers/login");
const MONGODB_URI = require("./utils/config").MONGODB_URI;
const {info, error} = require("./utils/logger");
const { tokenExtractor } = require('./utils/middleware');

const mongoUrl = process.env.MONGODB_URI;
mongoose.connect(mongoUrl)
    .then(res => info("connected to the database"))
    .catch(err => error(err.message))

app.use(cors());
app.use(tokenExtractor)
app.use(express.json());
app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

module.exports = app;