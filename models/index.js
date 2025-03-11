const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    password: {
        type:String,
    },
    id: String,
    provider:{
        type:String,
        enum:["email","google"],
    }
})

const User = mongoose.model("User",UserSchema)

module.exports = User