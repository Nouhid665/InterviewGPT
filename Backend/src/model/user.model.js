const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: [true, "Username already taken"]
    },
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: [true, "Email is already taken"]
    },
    password:{
        type: String,
        required: [true, "Password is required"],
    }
})

//creating a model help to apply operatin like find(), findOne() , create()
const userModel = mongoose.model("user", userSchema)

module.exports = userModel