const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {type: String},
    username: {type: String},
    password: {type: String}
})

userSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
    }
})

const User = mongoose.model("User", userSchema);
module.exports = User;