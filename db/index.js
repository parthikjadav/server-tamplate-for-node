const mongoose = require("mongoose")

const connectDB = ()=>{
    mongoose.connect("mongodb://localhost:27017/test")
    .then(()=>console.log("connected to mongodb "))
    .catch(()=> console.log("failed to coonect db"))
}

module.exports=connectDB