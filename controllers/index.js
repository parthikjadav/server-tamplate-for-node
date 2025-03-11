const { default: axios } = require("axios");
const User = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authController = {
    googleAuth: async (req, res) => {
        try {
            const { token } = req.body

            const googleResponse = await axios.get(
                `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`
            );

            const { name, email, sub: googleId } = googleResponse.data
            let user = await User.findOne({ email }).select("-password")

            if (!user) {
                try {
                    user = await User.create({
                        name,
                        email,
                        id: googleId,
                        provider: "google"
                    })
                } catch (error) {
                    console.log(error.message, "failed to create user");
                }
            }

            const JWT_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.status(200).json({
                token: JWT_token,
                success: true,
                message: "user created"
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "something went wrong"
            })
        }
    },
    signIn: async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "user not found"
                })
            } else {
                if (user.provider === "google") {
                    return res.status(401).json({
                        success: false,
                        message: "This account is created with google, Try Sign in with google"
                    })
                }
                
                const isPasswordMatched = await bcrypt.compare(password,user.password)
                
                if (!isPasswordMatched) {
                    return res.status(401).json({
                        success: false,
                        message: "password not matched"
                    })
                } else {
                    const JWT_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
                    
                    res.status(200).json({
                        success: true,
                        message: "user logged in",
                        token: JWT_token
                    })
                }
            }
        }
        catch (e) {
            res.status(500).json({
                success: false,
                message: e.message
            })
        }

    },
    signUp: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(401).json({
                    success: false,
                    message: "please provide all fields"
                })
            }
            const user = await User.findOne({ email })

            if (user) {
                if (user.provider === "google") {
                    return res.status(401).json({
                        success: false,
                        message: "Try sign in with google"
                    })
                }
                return res.status(401).json({
                    success: false,
                    message: "user already exists"
                })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)

                const newUser = await User.create({ name, email, password: hashedPassword })
                const JWT_token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
                res.status(200).json({
                    success: true,
                    token: JWT_token,
                    message: "user created",
                })
            }
        } catch (e) {
            res.status(500).json({
                success: false,
                message: e.message
            }
            )
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select("-password")
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "user not found"
                })
            }
            res.status(200).json({
                success: true,
                user
            })
        } catch (e) {
            res.status(500).json({
                success: false,
                message: e.message
            })
        }
    }
}

module.exports = {
    authController
}