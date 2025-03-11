require("dotenv").config()
const { default: axios } = require("axios")
const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const connectDB = require("./db")
const routes = require("./routes")
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cors({ origin: "*" }))

connectDB()

app.use("/api",routes)

app.listen(3000, () => {
    console.log('server is running on port 3000');
})